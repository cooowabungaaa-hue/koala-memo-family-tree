import { useCallback, useEffect, useMemo } from 'react';
import { ReactFlow, Controls, Background, useNodesState, useEdgesState, addEdge } from '@xyflow/react';
import type { Edge, NodeTypes, Connection } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useKoalas } from '../context/KoalaContext';
import { buildFamilyTreeData, getLayoutedElements } from '../lib/familyTree';
import FamilyTreeNode from './FamilyTreeNode';
import type { FamilyTreeNodeType } from './FamilyTreeNode';
import { useLocation } from 'wouter';

interface FamilyTreeGraphProps {
    centerId: string;
}

const FamilyTreeGraph = ({ centerId }: FamilyTreeGraphProps) => {
    const { koalaMap } = useKoalas();
    const [nodes, setNodes, onNodesChange] = useNodesState<FamilyTreeNodeType>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [, setLocation] = useLocation();

    const nodeTypes = useMemo<NodeTypes>(() => ({ koalaNode: FamilyTreeNode }), []);

    useEffect(() => {
        if (!centerId || koalaMap.size === 0) return;

        // 1. Build raw graph data
        const { nodes: rawNodes, edges: rawEdges } = buildFamilyTreeData(centerId, koalaMap);

        // 2. Apply Dagre layout
        const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
            rawNodes,
            rawEdges
        );

        setNodes(layoutedNodes);
        setEdges(layoutedEdges);
    }, [centerId, koalaMap, setNodes, setEdges]);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const onNodeClick = useCallback((_event: React.MouseEvent, node: FamilyTreeNodeType) => {
        setLocation(`/tree/${node.id}`);
    }, [setLocation]);

    return (
        <div style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }} className="border rounded-xl overflow-hidden bg-gray-50 dark:bg-zinc-900">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                onNodeClick={onNodeClick}
                fitView
                attributionPosition="bottom-right"
            >
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    );
};

export default FamilyTreeGraph;
