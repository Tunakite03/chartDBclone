import type { Diagram } from '@/lib/domain/diagram';
import { generateDiagramId, generateId } from '@/lib/utils';
import type { DBTable } from '@/lib/domain/db-table';
import type { Cardinality, DBRelationship } from '@/lib/domain/db-relationship';
import type { DBField } from '@/lib/domain/db-field';
import type { DataTypeData } from '@/lib/data/data-types/data-types';
import { findDataTypeDataById } from '@/lib/data/data-types/data-types';
import { defaultTableColor } from '@/lib/colors';
import type { DatabaseType } from '@/lib/domain/database-type';
import { getTableIndexesWithPrimaryKey, type DBIndex } from '@/lib/domain';
import {
    DBCustomTypeKind,
    type DBCustomType,
} from '@/lib/domain/db-custom-type';

export const defaultPrismaDiagramName = 'Prisma Import';

const PRISMA_TYPE_MAP: Record<string, string> = {
    string: 'varchar',
    int: 'integer',
    bigint: 'bigint',
    float: 'float',
    decimal: 'decimal',
    boolean: 'boolean',
    datetime: 'timestamp',
    json: 'json',
    bytes: 'bytea',
    unsupported: 'varchar',
};

interface PrismaField {
    name: string;
    type: string;
    isArray: boolean;
    isOptional: boolean;
    attributes: PrismaAttribute[];
    mapName?: string;
}

interface PrismaAttribute {
    name: string;
    args: string[];
}

interface PrismaModel {
    name: string;
    fields: PrismaField[];
    attributes: PrismaAttribute[];
    mapName?: string;
}

interface PrismaEnum {
    name: string;
    values: string[];
    mapName?: string;
}

interface PrismaRelationInfo {
    fields: string[];
    references: string[];
    name?: string;
}

const mapPrismaTypeToDataType = (
    prismaType: string,
    options?: { databaseType?: DatabaseType; enums?: PrismaEnum[] }
): DataTypeData => {
    const normalizedType = prismaType.toLowerCase();

    // Check if it's an enum type
    if (options?.enums) {
        const enumDef = options.enums.find(
            (e) => e.name.toLowerCase() === normalizedType
        );
        if (enumDef) {
            return {
                id: enumDef.name,
                name: enumDef.name,
            } satisfies DataTypeData;
        }
    }

    const mapped = PRISMA_TYPE_MAP[normalizedType];
    if (mapped) {
        const matchedType = findDataTypeDataById(mapped, options?.databaseType);
        if (matchedType) return matchedType;
        return { id: mapped, name: mapped } satisfies DataTypeData;
    }

    // Try direct match against database types
    const matchedType = findDataTypeDataById(
        normalizedType,
        options?.databaseType
    );
    if (matchedType) return matchedType;

    return {
        id: normalizedType.split(' ').join('_').toLowerCase(),
        name: normalizedType,
    } satisfies DataTypeData;
};

const parseAttributes = (line: string): PrismaAttribute[] => {
    const attributes: PrismaAttribute[] = [];
    const attrRegex = /@(\w+)(?:\(([^)]*)\))?/g;
    let match;

    while ((match = attrRegex.exec(line)) !== null) {
        const name = match[1];
        const rawArgs = match[2] ?? '';
        const args = rawArgs
            ? rawArgs
                  .split(',')
                  .map((a) => a.trim())
                  .filter(Boolean)
            : [];
        attributes.push({ name, args });
    }

    return attributes;
};

const parseBlockAttributes = (bodyLines: string[]): PrismaAttribute[] => {
    const attributes: PrismaAttribute[] = [];

    for (const line of bodyLines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('@@')) continue;

        const attrRegex = /@@(\w+)\(([^)]*)\)/;
        const match = attrRegex.exec(trimmed);
        if (match) {
            const name = match[1];
            const rawArgs = match[2];
            const args = rawArgs
                ? rawArgs
                      .split(',')
                      .map((a) => a.trim())
                      .filter(Boolean)
                : [];
            attributes.push({ name, args });
        }
    }

    return attributes;
};

const extractFieldsFromArgs = (args: string[]): string[] => {
    const joined = args.join(', ');
    const fieldsMatch = /\[([^\]]+)\]/.exec(joined);
    if (!fieldsMatch) return [];
    return fieldsMatch[1].split(',').map((f) => f.trim());
};

const parseRelationAttribute = (
    attributes: PrismaAttribute[]
): PrismaRelationInfo | null => {
    const relationAttr = attributes.find((a) => a.name === 'relation');
    if (!relationAttr) return null;

    const joined = relationAttr.args.join(', ');
    const fieldsMatch = /fields:\s*\[([^\]]+)\]/.exec(joined);
    const referencesMatch = /references:\s*\[([^\]]+)\]/.exec(joined);
    const nameMatch = /^"([^"]+)"/.exec(joined);

    if (!fieldsMatch || !referencesMatch) return null;

    return {
        fields: fieldsMatch[1].split(',').map((f) => f.trim()),
        references: referencesMatch[1].split(',').map((f) => f.trim()),
        name: nameMatch?.[1],
    };
};

const parseField = (line: string): PrismaField | null => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//') || trimmed.startsWith('@@')) {
        return null;
    }

    // Match: fieldName Type? @attributes...
    // or:    fieldName Type[] @attributes...
    // or:    fieldName Type @attributes...
    const fieldRegex = /^(\w+)\s+(\w+)(\[\])?([\s?]*)(.*)$/;
    const match = fieldRegex.exec(trimmed);
    if (!match) return null;

    const name = match[1];
    const type = match[2];
    const isArray = !!match[3];
    const restBeforeAttrs = match[4];
    const rest = match[5];

    const isOptional =
        restBeforeAttrs.includes('?') || trimmed.includes(`${type}?`);
    const attributes = parseAttributes(rest);

    // Check for @map
    const mapAttr = attributes.find((a) => a.name === 'map');
    const mapName = mapAttr?.args[0]?.replace(/["']/g, '');

    return { name, type, isArray, isOptional, attributes, mapName };
};

const parseModels = (content: string): PrismaModel[] => {
    const models: PrismaModel[] = [];
    const modelRegex = /model\s+(\w+)\s*\{([^}]+)\}/g;
    let match;

    while ((match = modelRegex.exec(content)) !== null) {
        const name = match[1];
        const body = match[2];
        const bodyLines = body.split('\n');

        const fields: PrismaField[] = [];
        for (const line of bodyLines) {
            const field = parseField(line);
            if (field) {
                fields.push(field);
            }
        }

        const blockAttributes = parseBlockAttributes(bodyLines);

        // Check for @@map
        const mapAttr = blockAttributes.find((a) => a.name === 'map');
        const mapName = mapAttr?.args[0]?.replace(/["']/g, '');

        models.push({ name, fields, attributes: blockAttributes, mapName });
    }

    return models;
};

const parseEnums = (content: string): PrismaEnum[] => {
    const enums: PrismaEnum[] = [];
    const enumRegex = /enum\s+(\w+)\s*\{([^}]+)\}/g;
    let match;

    while ((match = enumRegex.exec(content)) !== null) {
        const name = match[1];
        const body = match[2];
        const values = body
            .split('\n')
            .map((line) => line.trim())
            .filter(
                (line) =>
                    line && !line.startsWith('//') && !line.startsWith('@@')
            );

        // Check for @@map
        const bodyLines = body.split('\n');
        const blockAttrs = parseBlockAttributes(bodyLines);
        const mapAttr = blockAttrs.find((a) => a.name === 'map');
        const mapName = mapAttr?.args[0]?.replace(/["']/g, '');

        enums.push({ name, values, mapName });
    }

    return enums;
};

const isRelationField = (
    field: PrismaField,
    models: PrismaModel[]
): boolean => {
    // A relation field's type references another model (not a scalar type)
    const isModelType = models.some((m) => m.name === field.type);
    return isModelType;
};

const determineCardinality = (
    field: DBField,
    referencedField: DBField
): { sourceCardinality: Cardinality; targetCardinality: Cardinality } => {
    const isSourceUnique = field.unique || field.primaryKey;
    const isTargetUnique = referencedField.unique || referencedField.primaryKey;

    if (isSourceUnique && isTargetUnique) {
        return { sourceCardinality: 'one', targetCardinality: 'one' };
    } else if (isSourceUnique) {
        return { sourceCardinality: 'one', targetCardinality: 'many' };
    } else if (isTargetUnique) {
        return { sourceCardinality: 'many', targetCardinality: 'one' };
    }
    return { sourceCardinality: 'many', targetCardinality: 'many' };
};

const extractDecimalPrecision = (
    attributes: PrismaAttribute[]
): { precision?: number; scale?: number } => {
    const dbTypeAttr = attributes.find(
        (a) => a.name === 'db' || a.args.some((arg) => arg.includes('Decimal'))
    );
    if (!dbTypeAttr) return {};

    for (const arg of dbTypeAttr.args) {
        const decimalMatch = /Decimal\((\d+),\s*(\d+)\)/.exec(arg);
        if (decimalMatch) {
            return {
                precision: parseInt(decimalMatch[1]),
                scale: parseInt(decimalMatch[2]),
            };
        }
    }

    return {};
};

const extractVarcharLength = (
    attributes: PrismaAttribute[]
): string | undefined => {
    for (const attr of attributes) {
        for (const arg of attr.args) {
            const varcharMatch = /VarChar\((\d+)\)|Char\((\d+)\)/.exec(arg);
            if (varcharMatch) {
                return varcharMatch[1] || varcharMatch[2];
            }
        }
    }
    return undefined;
};

export const importPrismaToDiagram = async (
    prismaContent: string,
    options: { databaseType: DatabaseType }
): Promise<Diagram> => {
    if (!prismaContent.trim()) {
        return {
            id: generateDiagramId(),
            name: defaultPrismaDiagramName,
            databaseType: options.databaseType,
            tables: [],
            relationships: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    }

    const models = parseModels(prismaContent);
    const enums = parseEnums(prismaContent);

    // First pass: create tables with fields (excluding relation fields)
    const tableMap = new Map<string, DBTable>();

    const tables: DBTable[] = models.map((model, index) => {
        const row = Math.floor(index / 4);
        const col = index % 4;
        const tableSpacing = 300;

        // Get @@id composite primary key fields
        const compositePKAttr = model.attributes.find((a) => a.name === 'id');
        const compositePKFields = compositePKAttr
            ? extractFieldsFromArgs(compositePKAttr.args)
            : [];

        // Get @@unique fields
        const uniqueAttrs = model.attributes.filter((a) => a.name === 'unique');
        const uniqueFieldSets = uniqueAttrs.map((a) =>
            extractFieldsFromArgs(a.args)
        );

        // Scalar fields only (exclude relation fields referencing other models)
        const scalarFields = model.fields.filter(
            (f) => !isRelationField(f, models)
        );

        const fields: DBField[] = scalarFields.map((field) => {
            const isPK =
                field.attributes.some((a) => a.name === 'id') ||
                compositePKFields.includes(field.name);
            const isUnique =
                field.attributes.some((a) => a.name === 'unique') ||
                uniqueFieldSets.some(
                    (set) => set.length === 1 && set.includes(field.name)
                ) ||
                isPK;
            const isAutoIncrement = field.attributes.some((a) =>
                a.args.some((arg) => arg.includes('autoincrement'))
            );
            const hasDefault = field.attributes.find(
                (a) => a.name === 'default'
            );

            let defaultValue: string | undefined;
            if (hasDefault && !isAutoIncrement) {
                const raw = hasDefault.args.join(', ');
                defaultValue = raw.replace(/["']/g, '');
            }

            const { precision, scale } = extractDecimalPrecision(
                field.attributes
            );
            const characterMaximumLength = extractVarcharLength(
                field.attributes
            );

            return {
                id: generateId(),
                name: field.mapName ?? field.name,
                type: mapPrismaTypeToDataType(field.type, {
                    databaseType: options.databaseType,
                    enums,
                }),
                primaryKey: isPK,
                unique: isUnique,
                nullable: field.isOptional,
                increment: isAutoIncrement || undefined,
                isArray: field.isArray || undefined,
                createdAt: Date.now(),
                characterMaximumLength,
                precision,
                scale,
                default: defaultValue,
            } satisfies DBField;
        });

        // Process @@index directives
        const indexAttrs = model.attributes.filter((a) => a.name === 'index');
        const indexes: DBIndex[] = indexAttrs.map((indexAttr) => {
            const indexFields = extractFieldsFromArgs(indexAttr.args);
            const fieldIds = indexFields
                .map((fieldName) => {
                    const f = fields.find(
                        (dbf) =>
                            dbf.name === fieldName ||
                            scalarFields.find((sf) => sf.name === fieldName)
                                ?.mapName === dbf.name
                    );
                    return f?.id;
                })
                .filter((id): id is string => !!id);

            // Extract index name from args like @@index([field1, field2], name: "idx_name")
            const joinedArgs = indexAttr.args.join(', ');
            const nameMatch = /name:\s*"([^"]+)"/.exec(joinedArgs);
            const indexName =
                nameMatch?.[1] ??
                `idx_${model.mapName ?? model.name}_${indexFields.join('_')}`;

            return {
                id: generateId(),
                name: indexName,
                fieldIds,
                unique: false,
                createdAt: Date.now(),
            } satisfies DBIndex;
        });

        // Process @@unique as unique indexes
        for (const uniqueAttr of uniqueAttrs) {
            const uniqueFields = extractFieldsFromArgs(uniqueAttr.args);
            if (uniqueFields.length > 1) {
                const fieldIds = uniqueFields
                    .map((fieldName) => {
                        const f = fields.find(
                            (dbf) =>
                                dbf.name === fieldName ||
                                scalarFields.find((sf) => sf.name === fieldName)
                                    ?.mapName === dbf.name
                        );
                        return f?.id;
                    })
                    .filter((id): id is string => !!id);

                const joinedArgs = uniqueAttr.args.join(', ');
                const nameMatch = /name:\s*"([^"]+)"/.exec(joinedArgs);
                const indexName =
                    nameMatch?.[1] ??
                    `uniq_${model.mapName ?? model.name}_${uniqueFields.join('_')}`;

                indexes.push({
                    id: generateId(),
                    name: indexName,
                    fieldIds,
                    unique: true,
                    createdAt: Date.now(),
                } satisfies DBIndex);
            }
        }

        // Composite PK as index
        if (compositePKFields.length > 1) {
            const pkFieldIds = compositePKFields
                .map((fieldName) => {
                    const f = fields.find(
                        (dbf) =>
                            dbf.name === fieldName ||
                            scalarFields.find((sf) => sf.name === fieldName)
                                ?.mapName === dbf.name
                    );
                    return f?.id;
                })
                .filter((id): id is string => !!id);

            indexes.push({
                id: generateId(),
                name: `pk_${model.mapName ?? model.name}`,
                fieldIds: pkFieldIds,
                unique: true,
                isPrimaryKey: true,
                createdAt: Date.now(),
            } satisfies DBIndex);
        }

        const tableToReturn: DBTable = {
            id: generateId(),
            name: model.mapName ?? model.name,
            x: col * tableSpacing,
            y: row * tableSpacing,
            fields,
            indexes,
            color: defaultTableColor,
            isView: false,
            createdAt: Date.now(),
            order: index,
        } satisfies DBTable;

        const tableWithPK = {
            ...tableToReturn,
            indexes: getTableIndexesWithPrimaryKey({ table: tableToReturn }),
        };

        tableMap.set(model.name, tableWithPK);
        return tableWithPK;
    });

    // Second pass: build relationships from @relation fields
    const relationships: DBRelationship[] = [];

    for (const model of models) {
        const sourceTable = tableMap.get(model.name);
        if (!sourceTable) continue;

        for (const field of model.fields) {
            if (!isRelationField(field, models)) continue;

            const relationInfo = parseRelationAttribute(field.attributes);
            if (!relationInfo) continue;

            const targetTable = tableMap.get(field.type);
            if (!targetTable) continue;

            // For each field/reference pair, create a relationship
            for (
                let i = 0;
                i < relationInfo.fields.length &&
                i < relationInfo.references.length;
                i++
            ) {
                const sourceFieldName = relationInfo.fields[i];
                const targetFieldName = relationInfo.references[i];

                // Find the actual scalar fields by original name
                const sourceScalarField = model.fields.find(
                    (f) => f.name === sourceFieldName
                );
                const sourceDBField = sourceTable.fields.find(
                    (f) =>
                        f.name ===
                        (sourceScalarField?.mapName ?? sourceFieldName)
                );

                const targetModel = models.find((m) => m.name === field.type);
                const targetScalarField = targetModel?.fields.find(
                    (f) => f.name === targetFieldName
                );
                const targetDBField = targetTable.fields.find(
                    (f) =>
                        f.name ===
                        (targetScalarField?.mapName ?? targetFieldName)
                );

                if (!sourceDBField || !targetDBField) continue;

                const { sourceCardinality, targetCardinality } =
                    determineCardinality(sourceDBField, targetDBField);

                relationships.push({
                    id: generateId(),
                    name: `${sourceTable.name}_${sourceDBField.name}_${targetTable.name}_${targetDBField.name}`,
                    sourceTableId: sourceTable.id,
                    targetTableId: targetTable.id,
                    sourceFieldId: sourceDBField.id,
                    targetFieldId: targetDBField.id,
                    sourceCardinality,
                    targetCardinality,
                    createdAt: Date.now(),
                } satisfies DBRelationship);
            }
        }
    }

    // Convert enums to custom types
    const customTypes: DBCustomType[] = enums.map((enumDef) => ({
        id: generateId(),
        name: enumDef.mapName ?? enumDef.name,
        kind: DBCustomTypeKind.enum,
        values: enumDef.values,
        order: 0,
    }));

    return {
        id: generateDiagramId(),
        name: defaultPrismaDiagramName,
        databaseType: options.databaseType,
        tables,
        relationships,
        customTypes,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
};
