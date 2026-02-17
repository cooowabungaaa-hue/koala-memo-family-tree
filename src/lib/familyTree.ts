import type { Koala } from '../types';
import dagre from 'dagre';
import type { Edge } from '@xyflow/react';
import { Position } from '@xyflow/react';
import type { FamilyTreeNodeType } from '../components/FamilyTreeNode';

const nodeWidth = 180;
const nodeHeight = 80;

export const getLayoutedElements = (
    nodes: FamilyTreeNodeType[],
    edges: Edge[],
    direction = 'TB'
) => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));

    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);

        // Shift slightly to center
        return {
            ...node,
            targetPosition: direction === 'LR' ? Position.Left : Position.Top,
            sourcePosition: direction === 'LR' ? Position.Right : Position.Bottom,
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            },
        };
    });

    return { nodes: layoutedNodes as FamilyTreeNodeType[], edges };
};

// Function to generate nodes and edges for a specific Koala's family tree
export const buildFamilyTreeData = (centerId: string, koalaMap: Map<string, Koala>) => {
    const nodes: FamilyTreeNodeType[] = [];
    const edges: Edge[] = [];
    const visited = new Set<string>();

    // Helper to add node if not exists
    const addNode = (id: string, isCenter = false) => {
        if (visited.has(id)) return;
        const k = koalaMap.get(id);
        if (!k) return;

        visited.add(id);
        nodes.push({
            id: k.id,
            data: {
                label: k.name,
                gender: k.gender as 'オス' | 'メス',
                isCenter,
                details: k
            },
            position: { x: 0, y: 0 }, // Initial position, will be laid out by dagre
            type: 'koalaNode', // Custom node type
        });
    };

    const centerKoala = koalaMap.get(centerId);
    if (!centerKoala) return { nodes: [], edges: [] };

    // 1. Add Center
    addNode(centerId, true);

    // 2. Add Parents (Ancestors) recursively - limit depth? maybe 2 generations
    const addAncestors = (currentId: string, depth: number) => {
        if (depth > 2) return;
        const current = koalaMap.get(currentId);
        if (!current) return;

        if (current.father_id) {
            addNode(current.father_id);
            edges.push({ id: `${current.father_id}-${currentId}`, source: current.father_id, target: currentId, type: 'smoothstep', animated: true });
            addAncestors(current.father_id, depth + 1);
        }
        if (current.mother_id) {
            addNode(current.mother_id);
            edges.push({ id: `${current.mother_id}-${currentId}`, source: current.mother_id, target: currentId, type: 'smoothstep', animated: true });
            addAncestors(current.mother_id, depth + 1);
        }
    };
    addAncestors(centerId, 0);

    // 3. Add Children (Descendants) - limit depth?

    const addDescendants = (currentId: string, depth: number) => {
        if (depth > 2) return;

        // Find children
        const children = Array.from(koalaMap.values()).filter(k => k.father_id === currentId || k.mother_id === currentId);

        children.forEach(child => {
            addNode(child.id);
            edges.push({ id: `${currentId}-${child.id}`, source: currentId, target: child.id, type: 'smoothstep', animated: true });
            addDescendants(child.id, depth + 1);
        });
    };
    addDescendants(centerId, 0);

    return { nodes, edges };
};
