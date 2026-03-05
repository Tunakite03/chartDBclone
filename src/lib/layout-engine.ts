import dagre from '@dagrejs/dagre';
import type { DBTable } from './domain/db-table';
import { getTableDimensions } from './domain/db-table';
import type { DBRelationship } from './domain/db-relationship';

export const LAYOUT_TYPES = {
    GRID: 'grid',
    TREE_VERTICAL: 'tree_vertical',
    TREE_HORIZONTAL: 'tree_horizontal',
    FORCE: 'force',
    CIRCULAR: 'circular',
} as const;

export type LayoutType = (typeof LAYOUT_TYPES)[keyof typeof LAYOUT_TYPES];

interface LayoutInput {
    tables: DBTable[];
    relationships: DBRelationship[];
}

interface LayoutPosition {
    id: string;
    x: number;
    y: number;
}

const GAP_X = 100;
const GAP_Y = 80;

export function applyLayout(
    input: LayoutInput,
    layoutType: LayoutType
): LayoutPosition[] {
    const { tables, relationships } = input;
    if (tables.length === 0) return [];

    switch (layoutType) {
        case LAYOUT_TYPES.GRID:
            return applyGridLayout(tables);
        case LAYOUT_TYPES.TREE_VERTICAL:
            return applyDagreLayout(tables, relationships, 'TB');
        case LAYOUT_TYPES.TREE_HORIZONTAL:
            return applyDagreLayout(tables, relationships, 'LR');
        case LAYOUT_TYPES.FORCE:
            return applyForceLayout(tables, relationships);
        case LAYOUT_TYPES.CIRCULAR:
            return applyCircularLayout(tables, relationships);
        default:
            return applyGridLayout(tables);
    }
}

function applyGridLayout(tables: DBTable[]): LayoutPosition[] {
    const cols = Math.max(1, Math.ceil(Math.sqrt(tables.length)));

    return tables.map((table, index) => {
        const col = index % cols;
        const row = Math.floor(index / cols);
        const { width, height } = getTableDimensions(table);

        return {
            id: table.id,
            x: col * (width + GAP_X),
            y: row * (height + GAP_Y),
        };
    });
}

function applyDagreLayout(
    tables: DBTable[],
    relationships: DBRelationship[],
    direction: 'TB' | 'LR'
): LayoutPosition[] {
    const g = new dagre.graphlib.Graph();
    g.setDefaultEdgeLabel(() => ({}));
    g.setGraph({
        rankdir: direction,
        nodesep: GAP_X,
        ranksep: GAP_Y,
        marginx: 50,
        marginy: 50,
    });

    const tableIds = new Set(tables.map((t) => t.id));

    tables.forEach((table) => {
        const { width, height } = getTableDimensions(table);
        g.setNode(table.id, { width, height });
    });

    relationships.forEach((rel) => {
        if (
            tableIds.has(rel.sourceTableId) &&
            tableIds.has(rel.targetTableId)
        ) {
            g.setEdge(rel.sourceTableId, rel.targetTableId);
        }
    });

    dagre.layout(g);

    return tables.map((table) => {
        const node = g.node(table.id);
        const { width, height } = getTableDimensions(table);
        // dagre returns center positions, convert to top-left
        return {
            id: table.id,
            x: node.x - width / 2,
            y: node.y - height / 2,
        };
    });
}

function applyForceLayout(
    tables: DBTable[],
    relationships: DBRelationship[]
): LayoutPosition[] {
    const tableIds = new Set(tables.map((t) => t.id));

    // Build adjacency for connected-component grouping
    const adjacency = new Map<string, Set<string>>();
    tables.forEach((t) => adjacency.set(t.id, new Set()));

    relationships.forEach((rel) => {
        if (
            tableIds.has(rel.sourceTableId) &&
            tableIds.has(rel.targetTableId)
        ) {
            adjacency.get(rel.sourceTableId)!.add(rel.targetTableId);
            adjacency.get(rel.targetTableId)!.add(rel.sourceTableId);
        }
    });

    // Initialise positions in a circle so the simulation starts uniformly
    const positions = new Map<string, { x: number; y: number }>();
    const radius = Math.max(200, tables.length * 30);

    tables.forEach((table, i) => {
        const angle = (2 * Math.PI * i) / tables.length;
        positions.set(table.id, {
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle),
        });
    });

    const iterations = 300;
    const repulsionStrength = 5000;
    const attractionStrength = 0.005;
    const idealDistance = 350;
    const dampingStart = 0.9;
    const dampingEnd = 0.1;

    for (let iter = 0; iter < iterations; iter++) {
        const t = iter / iterations;
        const damping = dampingStart + (dampingEnd - dampingStart) * t;
        const forces = new Map<string, { fx: number; fy: number }>();

        tables.forEach((table) => forces.set(table.id, { fx: 0, fy: 0 }));

        // Repulsion between all pairs
        for (let i = 0; i < tables.length; i++) {
            for (let j = i + 1; j < tables.length; j++) {
                const a = tables[i];
                const b = tables[j];
                const posA = positions.get(a.id)!;
                const posB = positions.get(b.id)!;

                let dx = posA.x - posB.x;
                let dy = posA.y - posB.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 1) {
                    dx = Math.random() - 0.5;
                    dy = Math.random() - 0.5;
                    dist = 1;
                }

                const force = repulsionStrength / (dist * dist);
                const fx = (dx / dist) * force;
                const fy = (dy / dist) * force;

                forces.get(a.id)!.fx += fx;
                forces.get(a.id)!.fy += fy;
                forces.get(b.id)!.fx -= fx;
                forces.get(b.id)!.fy -= fy;
            }
        }

        // Attraction along edges
        relationships.forEach((rel) => {
            if (
                !tableIds.has(rel.sourceTableId) ||
                !tableIds.has(rel.targetTableId)
            )
                return;

            const posA = positions.get(rel.sourceTableId)!;
            const posB = positions.get(rel.targetTableId)!;

            const dx = posB.x - posA.x;
            const dy = posB.y - posA.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 1) return;

            const displacement = dist - idealDistance;
            const force = attractionStrength * displacement;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            forces.get(rel.sourceTableId)!.fx += fx;
            forces.get(rel.sourceTableId)!.fy += fy;
            forces.get(rel.targetTableId)!.fx -= fx;
            forces.get(rel.targetTableId)!.fy -= fy;
        });

        // Apply forces with damping
        tables.forEach((table) => {
            const pos = positions.get(table.id)!;
            const f = forces.get(table.id)!;
            pos.x += f.fx * damping;
            pos.y += f.fy * damping;
        });
    }

    // Normalise: shift so min x/y is at origin
    let minX = Infinity;
    let minY = Infinity;
    positions.forEach((pos) => {
        minX = Math.min(minX, pos.x);
        minY = Math.min(minY, pos.y);
    });

    return tables.map((table) => {
        const pos = positions.get(table.id)!;
        return {
            id: table.id,
            x: pos.x - minX + 50,
            y: pos.y - minY + 50,
        };
    });
}

function applyCircularLayout(
    tables: DBTable[],
    relationships: DBRelationship[]
): LayoutPosition[] {
    if (tables.length === 1) {
        return [{ id: tables[0].id, x: 0, y: 0 }];
    }

    const tableIds = new Set(tables.map((t) => t.id));

    // Sort so connected tables are placed near each other on the circle
    const adjacency = new Map<string, Set<string>>();
    tables.forEach((t) => adjacency.set(t.id, new Set()));

    relationships.forEach((rel) => {
        if (
            tableIds.has(rel.sourceTableId) &&
            tableIds.has(rel.targetTableId)
        ) {
            adjacency.get(rel.sourceTableId)!.add(rel.targetTableId);
            adjacency.get(rel.targetTableId)!.add(rel.sourceTableId);
        }
    });

    // BFS ordering from the most-connected node
    const sorted: DBTable[] = [];
    const visited = new Set<string>();

    const sortedByConnections = [...tables].sort(
        (a, b) =>
            (adjacency.get(b.id)?.size ?? 0) - (adjacency.get(a.id)?.size ?? 0)
    );

    const queue: string[] = [];

    const startBfs = (startId: string) => {
        queue.push(startId);
        visited.add(startId);
        while (queue.length > 0) {
            const id = queue.shift()!;
            const table = tables.find((t) => t.id === id);
            if (table) sorted.push(table);

            const neighbors = adjacency.get(id) ?? new Set();
            neighbors.forEach((nId) => {
                if (!visited.has(nId)) {
                    visited.add(nId);
                    queue.push(nId);
                }
            });
        }
    };

    // BFS from each unvisited node to handle disconnected components
    sortedByConnections.forEach((t) => {
        if (!visited.has(t.id)) {
            startBfs(t.id);
        }
    });

    const maxDim = Math.max(
        ...sorted.map((t) => {
            const d = getTableDimensions(t);
            return Math.max(d.width, d.height);
        })
    );

    const circumference = sorted.length * (maxDim + GAP_X);
    const radius = Math.max(300, circumference / (2 * Math.PI));

    return sorted.map((table, i) => {
        const angle = (2 * Math.PI * i) / sorted.length - Math.PI / 2;
        const { width, height } = getTableDimensions(table);
        return {
            id: table.id,
            x: radius * Math.cos(angle) - width / 2 + radius + 50,
            y: radius * Math.sin(angle) - height / 2 + radius + 50,
        };
    });
}
