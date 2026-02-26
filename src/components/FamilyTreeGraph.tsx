import { useCallback, useEffect, useMemo } from 'react';
import { ReactFlow, Controls, Background, useNodesState, useEdgesState, addEdge, BackgroundVariant } from '@xyflow/react';
import type { Edge, NodeTypes, Connection } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useKoalas } from '../context/KoalaContext';
import { buildFamilyTreeData, getLayoutedElements } from '../lib/familyTree';
import FamilyTreeNode from './FamilyTreeNode';
import type { FamilyTreeNodeType } from './FamilyTreeNode';

interface FamilyTreeGraphProps {
    centerId: string;
}

const defaultEdgeOptions = {
    style: { stroke: '#7D9D78', strokeWidth: 2 },
    type: 'smoothstep',
    animated: true,
};

const FamilyTreeGraph = ({ centerId }: FamilyTreeGraphProps) => {
    const { koalaMap } = useKoalas();
    const [nodes, setNodes, onNodesChange] = useNodesState<FamilyTreeNodeType>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

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

    const onNodeClick = useCallback(() => {
        // Just center the node if needed or do nothing. For now, matching the one-page flow.
    }, []);

    return (
        <div style={{ height: '500px' }} className="w-full bg-[#fdfdfd] shadow-inner relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                onNodeClick={onNodeClick}
                defaultEdgeOptions={defaultEdgeOptions}
                fitView
                className="family-tree-flow"
                proOptions={{ hideAttribution: true }}
            >
                <Background color="#7D9D78" gap={24} size={1} variant={BackgroundVariant.Dots} />
                <Controls showInteractive={false} className="bg-white/80 backdrop-blur-sm !border-none !shadow-xl !rounded-full overflow-hidden mb-2 ml-2" />
            </ReactFlow>
        </div>
    );
};

export default FamilyTreeGraph;
