import { describe, it, expect } from 'vitest';
import { importPrismaToDiagram } from '../prisma-import';
import { DatabaseType } from '@/lib/domain/database-type';

describe('Prisma Import', () => {
    it('should return empty diagram for empty content', async () => {
        const diagram = await importPrismaToDiagram('', {
            databaseType: DatabaseType.POSTGRESQL,
        });

        expect(diagram.tables).toEqual([]);
        expect(diagram.relationships).toEqual([]);
    });

    it('should parse a simple model with fields', async () => {
        const prismaContent = `
model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}`;

        const diagram = await importPrismaToDiagram(prismaContent, {
            databaseType: DatabaseType.POSTGRESQL,
        });

        expect(diagram.tables).toHaveLength(1);

        const userTable = diagram.tables![0];
        expect(userTable.name).toBe('User');
        expect(userTable.fields).toHaveLength(3);

        const idField = userTable.fields.find((f) => f.name === 'id');
        expect(idField?.primaryKey).toBe(true);
        expect(idField?.increment).toBe(true);

        const emailField = userTable.fields.find((f) => f.name === 'email');
        expect(emailField?.unique).toBe(true);
        expect(emailField?.nullable).toBe(false);

        const nameField = userTable.fields.find((f) => f.name === 'name');
        expect(nameField?.nullable).toBe(true);
    });

    it('should parse relationships between models', async () => {
        const prismaContent = `
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model Post {
  id       Int    @id @default(autoincrement())
  title    String
  authorId Int
  author   User   @relation(fields: [authorId], references: [id])
}`;

        const diagram = await importPrismaToDiagram(prismaContent, {
            databaseType: DatabaseType.POSTGRESQL,
        });

        expect(diagram.tables).toHaveLength(2);
        expect(diagram.relationships).toHaveLength(1);

        const rel = diagram.relationships![0];
        const postTable = diagram.tables!.find((t) => t.name === 'Post');
        const userTable = diagram.tables!.find((t) => t.name === 'User');

        expect(rel.sourceTableId).toBe(postTable?.id);
        expect(rel.targetTableId).toBe(userTable?.id);
    });

    it('should parse enums as custom types', async () => {
        const prismaContent = `
enum Role {
  USER
  ADMIN
  MODERATOR
}

model User {
  id   Int    @id @default(autoincrement())
  role Role
}`;

        const diagram = await importPrismaToDiagram(prismaContent, {
            databaseType: DatabaseType.POSTGRESQL,
        });

        expect(diagram.customTypes).toHaveLength(1);
        expect(diagram.customTypes![0].name).toBe('Role');
        expect(diagram.customTypes![0].values).toEqual([
            'USER',
            'ADMIN',
            'MODERATOR',
        ]);
    });

    it('should handle composite primary keys (@@id)', async () => {
        const prismaContent = `
model PostTag {
  postId Int
  tagId  Int

  @@id([postId, tagId])
}`;

        const diagram = await importPrismaToDiagram(prismaContent, {
            databaseType: DatabaseType.POSTGRESQL,
        });

        const table = diagram.tables![0];
        const postIdField = table.fields.find((f) => f.name === 'postId');
        const tagIdField = table.fields.find((f) => f.name === 'tagId');

        expect(postIdField?.primaryKey).toBe(true);
        expect(tagIdField?.primaryKey).toBe(true);

        // Should have a PK index
        const pkIndex = table.indexes.find((i) => i.isPrimaryKey);
        expect(pkIndex).toBeDefined();
        expect(pkIndex?.fieldIds).toHaveLength(2);
    });

    it('should handle @@index directives', async () => {
        const prismaContent = `
model User {
  id    Int    @id @default(autoincrement())
  email String
  name  String

  @@index([email, name])
}`;

        const diagram = await importPrismaToDiagram(prismaContent, {
            databaseType: DatabaseType.POSTGRESQL,
        });

        const table = diagram.tables![0];
        const nonPKIndexes = table.indexes.filter((i) => !i.isPrimaryKey);
        expect(nonPKIndexes).toHaveLength(1);
        expect(nonPKIndexes[0].fieldIds).toHaveLength(2);
    });

    it('should handle @@unique directives', async () => {
        const prismaContent = `
model User {
  id        Int    @id @default(autoincrement())
  firstName String
  lastName  String

  @@unique([firstName, lastName])
}`;

        const diagram = await importPrismaToDiagram(prismaContent, {
            databaseType: DatabaseType.POSTGRESQL,
        });

        const table = diagram.tables![0];
        const uniqueIndexes = table.indexes.filter(
            (i) => i.unique && !i.isPrimaryKey
        );
        expect(uniqueIndexes).toHaveLength(1);
        expect(uniqueIndexes[0].fieldIds).toHaveLength(2);
    });

    it('should handle @map and @@map directives', async () => {
        const prismaContent = `
model User {
  id        Int    @id @default(autoincrement())
  firstName String @map("first_name")

  @@map("users")
}`;

        const diagram = await importPrismaToDiagram(prismaContent, {
            databaseType: DatabaseType.POSTGRESQL,
        });

        const table = diagram.tables![0];
        expect(table.name).toBe('users');

        const firstNameField = table.fields.find(
            (f) => f.name === 'first_name'
        );
        expect(firstNameField).toBeDefined();
    });

    it('should exclude relation fields from table fields', async () => {
        const prismaContent = `
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model Post {
  id       Int    @id @default(autoincrement())
  authorId Int
  author   User   @relation(fields: [authorId], references: [id])
}`;

        const diagram = await importPrismaToDiagram(prismaContent, {
            databaseType: DatabaseType.POSTGRESQL,
        });

        const userTable = diagram.tables!.find((t) => t.name === 'User');
        // "posts" is a relation field and should be excluded
        expect(userTable?.fields).toHaveLength(1);

        const postTable = diagram.tables!.find((t) => t.name === 'Post');
        // "author" is a relation field and should be excluded
        expect(postTable?.fields).toHaveLength(2);
    });

    it('should handle array fields', async () => {
        const prismaContent = `
model User {
  id   Int      @id @default(autoincrement())
  tags String[]
}`;

        const diagram = await importPrismaToDiagram(prismaContent, {
            databaseType: DatabaseType.POSTGRESQL,
        });

        const table = diagram.tables![0];
        const tagsField = table.fields.find((f) => f.name === 'tags');
        expect(tagsField?.isArray).toBe(true);
    });

    it('should handle default values', async () => {
        const prismaContent = `
model User {
  id        Int      @id @default(autoincrement())
  isActive  Boolean  @default(true)
  role      String   @default("user")
  createdAt DateTime @default(now())
}`;

        const diagram = await importPrismaToDiagram(prismaContent, {
            databaseType: DatabaseType.POSTGRESQL,
        });

        const table = diagram.tables![0];
        const isActiveField = table.fields.find((f) => f.name === 'isActive');
        expect(isActiveField?.default).toBe('true');

        const roleField = table.fields.find((f) => f.name === 'role');
        expect(roleField?.default).toBe('user');
    });

    it('should handle complex multi-model schema', async () => {
        const prismaContent = `
model User {
  id       Int       @id @default(autoincrement())
  email    String    @unique
  name     String?
  posts    Post[]
  comments Comment[]
}

model Post {
  id       Int       @id @default(autoincrement())
  title    String
  content  String?
  authorId Int
  author   User      @relation(fields: [authorId], references: [id])
  comments Comment[]
}

model Comment {
  id       Int    @id @default(autoincrement())
  text     String
  postId   Int
  userId   Int
  post     Post   @relation(fields: [postId], references: [id])
  user     User   @relation(fields: [userId], references: [id])
}`;

        const diagram = await importPrismaToDiagram(prismaContent, {
            databaseType: DatabaseType.POSTGRESQL,
        });

        expect(diagram.tables).toHaveLength(3);
        expect(diagram.relationships).toHaveLength(3);
    });
});
