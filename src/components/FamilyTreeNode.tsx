import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { Node, NodeProps } from '@xyflow/react';
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
            px-4 py-3 shadow-sm rounded-2xl border transition-all min-w-[160px]
            ${data.isCenter
                ? 'border-koala-base bg-white ring-4 ring-koala-base/10'
                : 'border-gray-100 bg-white'}
            ${!isAlive ? 'opacity-60 grayscale-[0.2]' : ''}
        `}>
            {/* Dot handle */}
            <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-koala-base !border-none" />

            <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 shadow-inner text-white ${isMale ? 'bg-koala-base' : 'bg-pink-400'}`}>
                    🐨
                </div>
                <div className="min-w-0">
                    <div className="text-[10px] text-gray-400 font-medium mb-0.5 tracking-wider truncate uppercase">{data.details.id}</div>
                    <div className="font-bold text-sm text-koala-text leading-tight truncate">
                        {data.details.name}
                    </div>
                </div>
            </div>

            <div className="mt-2 pt-2 border-t border-gray-50 flex justify-between items-center text-[9px]">
                <span className="text-gray-400 font-medium">{data.details.zoo}</span>
                {!isAlive && <span className="text-red-400 font-bold">🌈 {data.details.death}</span>}
            </div>

            <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-koala-base !border-none" />
        </div>
    );
};

export default memo(FamilyTreeNode);
