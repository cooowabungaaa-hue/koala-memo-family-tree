import { useState, useMemo } from 'react';
import { useKoalas } from '../context/KoalaContext';
import { calculateKinship } from '../lib/kinship';
import { ArrowUpDown, Calculator, Info, Archive } from 'lucide-react';
import KoalaSearchInput from '../components/KoalaSearchInput';
import type { Koala } from '../types';

export default function KinshipCalculator() {
    const { koalaMap } = useKoalas();
    const [koalaA, setKoalaA] = useState<Koala | null>(null);
    const [koalaB, setKoalaB] = useState<Koala | null>(null);

    const result = useMemo(() => {
        if (!koalaA || !koalaB || !koalaMap.size) return null;
        return calculateKinship(koalaA.id, koalaB.id, koalaMap);
    }, [koalaA, koalaB, koalaMap]);

    const KoalaMiniCard = ({ koala }: { koala: Koala }) => (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 shadow-inner text-white ${koala.gender === 'オス' ? 'bg-koala-base' : 'bg-pink-400'}`}>
                🐨
            </div>
            <div className="min-w-0">
                <div className="font-bold text-sm text-gray-800 truncate">{koala.name}</div>
                <div className="text-[10px] text-gray-400 truncate">{koala.zoo}</div>
            </div>
        </div>
    );

    return (
        <div className="flex-grow flex flex-col px-5 pb-10">
            <div className="space-y-4 mb-8">
                <div className="relative">
                    <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-koala-base text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm z-10 transition-transform hover:scale-110">A</span>
                    <KoalaSearchInput
                        onSelect={setKoalaA}
                        placeholder="コアラAを選択..."
                        className="w-full"
                    />
                </div>

                <div className="flex justify-center -my-2 relative z-0">
                    <div className="bg-koala-light p-2 rounded-full border border-gray-100 shadow-sm transition-colors hover:bg-gray-50">
                        <ArrowUpDown className="w-4 h-4 text-gray-400" />
                    </div>
                </div>

                <div className="relative">
                    <span className="absolute -left-2 top-1/2 -translate-y-1/2 w-6 h-6 bg-koala-dark text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm z-10 transition-transform hover:scale-110">B</span>
                    <KoalaSearchInput
                        onSelect={setKoalaB}
                        placeholder="コアラBを選択..."
                        className="w-full"
                    />
                </div>
            </div>

            {/* Result Section */}
            {!result ? (
                <div className="flex-grow flex items-center justify-center opacity-60">
                    <div className="text-center">
                        <Calculator className="w-16 h-16 mx-auto text-gray-300 mb-4" strokeWidth={1.5} />
                        <p className="text-gray-500 font-medium whitespace-pre-wrap">2頭のコアラのつながりを計算します</p>
                    </div>
                </div>
            ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {/* Coefficient Card */}
                    <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100 text-center relative overflow-hidden">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-koala-light rounded-full opacity-50"></div>

                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">血縁関係の強さ</h2>

                        <div className="relative inline-block">
                            <span className="text-5xl font-black text-koala-dark tracking-tighter">
                                {(result.coefficient * 100).toFixed(1)}
                            </span>
                            <span className="text-xl font-bold text-koala-base ml-1">%</span>
                        </div>

                        <div className="mt-4 px-6 py-2 bg-koala-light text-koala-dark font-black text-xl rounded-2xl inline-block shadow-inner border border-koala-base/10">
                            {result.relationship}
                        </div>
                    </div>

                    {/* Profiles */}
                    <div className="grid grid-cols-2 gap-3">
                        {koalaA && <KoalaMiniCard koala={koalaA} />}
                        {koalaB && <KoalaMiniCard koala={koalaB} />}
                    </div>

                    {/* Ancestors Card */}
                    {result.commonAncestors.length > 0 && (
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 space-y-4">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <Info className="w-4 h-4" /> 共通の祖先 ({result.commonAncestors.length})
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {result.commonAncestors.map(id => {
                                    const ancestor = koalaMap.get(id);
                                    return (
                                        <span key={id} className="px-3 py-1.5 bg-gray-50 text-gray-600 text-[11px] font-bold rounded-lg border border-gray-100 shadow-sm">
                                            {ancestor?.name || id}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {result.coefficient === 0 && (
                        <div className="text-center py-6">
                            <Archive className="w-10 h-10 mx-auto text-gray-300 mb-2 opacity-30" />
                            <p className="text-gray-400 text-xs text-pretty italic">
                                データ上では2頭に共通の祖先は見つかりませんでした
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
