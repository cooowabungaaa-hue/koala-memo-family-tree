import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { Node, NodeProps } from '@xyflow/react';
import { Mars, Venus } from 'lucide-react';
import type { Koala } from '../types';

export interface FamilyTreeNodeData extends Record<string, unknown> {
    label: string;
    gender: 'オス' | 'メス';
    isCenter?: boolean;
    details: Koala;
}

export type FamilyTreeNodeType = Node<FamilyTreeNodeData>;

const FamilyTreeNode = ({ data }: NodeProps<FamilyTreeNodeType>) => {
    const isMale = data.details.gender === 'オス';
    const isAlive = data.details.isAlive;

    return (
        <div className={`
            px-4 py-2 shadow-md rounded-lg border-2 min-w-[150px]
            ${data.isCenter ? 'border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20' : 'border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800'}
            ${!isAlive ? 'opacity-70 grayscale-[0.5]' : ''}
        `}>
            <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-gray-400" />

            <div className="flex items-start gap-2">
                <div className={`p-1 rounded-full ${isMale ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                    {isMale ? <Mars size={14} /> : <Venus size={14} />}
                </div>
                <div>
                    <div className="text-xs text-gray-500 font-mono mb-0.5">{data.details.id}</div>
                    <div className="font-bold text-sm text-gray-900 dark:text-gray-100 leading-tight">
                        {data.details.name}
                    </div>
                    {!isAlive && <div className="text-[10px] text-red-400 mt-1">🌈 {data.details.death}</div>}
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-gray-400" />
        </div>
    );
};

export default memo(FamilyTreeNode);
