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
            px-4 py-3 shadow-lg rounded-xl border-2 min-w-[170px] transition-all
            ${data.isCenter
                ? 'border-koala-green bg-green-50 dark:bg-koala-green/10 ring-4 ring-koala-green/20'
                : 'border-gray-100 dark:border-zinc-700 bg-white dark:bg-zinc-800'}
            ${!isAlive ? 'opacity-60 grayscale-[0.3]' : ''}
        `}>
            <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-koala-green border-2 border-white" />

            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full flex-shrink-0 ${isMale ? 'bg-blue-50 text-blue-500' : 'bg-pink-50 text-pink-500'}`}>
                    {isMale ? <Mars size={16} /> : <Venus size={16} />}
                </div>
                <div className="min-w-0">
                    <div className="text-[10px] text-gray-400 font-medium mb-0.5 tracking-wider uppercase truncate">{data.details.id}</div>
                    <div className="font-bold text-sm text-gray-800 dark:text-gray-100 leading-tight truncate">
                        {data.details.name}
                    </div>
                </div>
            </div>

            <div className="mt-2 pt-2 border-t border-gray-50 dark:border-zinc-700 flex justify-between items-center text-[10px]">
                <span className="text-gray-400">{data.details.zoo}</span>
                {!isAlive && <span className="text-red-400 font-bold">🌈 {data.details.death}</span>}
            </div>

            <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-koala-green border-2 border-white" />
        </div>
    );
};

export default memo(FamilyTreeNode);
