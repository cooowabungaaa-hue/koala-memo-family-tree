import { useState, useMemo } from 'react';
import { useKoalas } from '../context/KoalaContext';
import { calculateKinship } from '../lib/kinship';
import { KoalaCard } from '../components/KoalaCard';
import { ArrowLeftRight, Calculator } from 'lucide-react';

export default function KinshipCalculator() {
    const { koalaMap, koalas } = useKoalas();
    const [selectedA, setSelectedA] = useState<string>('');
    const [selectedB, setSelectedB] = useState<string>('');

    const result = useMemo(() => {
        if (!selectedA || !selectedB || !koalaMap.size) return null;
        return calculateKinship(selectedA, selectedB, koalaMap);
    }, [selectedA, selectedB, koalaMap]);

    return (
        <div className="p-4 max-w-4xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <Calculator className="text-green-600" />
                親戚度カリキュレーター
            </h1>

            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium mb-1">コアラ A</label>
                    <select
                        className="w-full p-2 rounded border dark:bg-zinc-800 dark:border-zinc-700"
                        value={selectedA}
                        onChange={(e) => setSelectedA(e.target.value)}
                    >
                        <option value="">選択してください</option>
                        {koalas.map(k => <option key={k.id} value={k.id}>{k.name} ({k.zoo})</option>)}
                    </select>
                </div>

                <ArrowLeftRight className="text-gray-400 rotate-90 md:rotate-0" />

                <div className="flex-1 w-full">
                    <label className="block text-sm font-medium mb-1">コアラ B</label>
                    <select
                        className="w-full p-2 rounded border dark:bg-zinc-800 dark:border-zinc-700"
                        value={selectedB}
                        onChange={(e) => setSelectedB(e.target.value)}
                    >
                        <option value="">選択してください</option>
                        {koalas.map(k => <option key={k.id} value={k.id}>{k.name} ({k.zoo})</option>)}
                    </select>
                </div>
            </div>

            {result && selectedA && selectedB && (
                <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-lg border-2 border-green-100 dark:border-green-900 animate-in fade-in slide-in-from-bottom-4">
                    <div className="text-center mb-6">
                        <h2 className="text-lg text-gray-500">血縁係数</h2>
                        <div className="text-5xl font-bold text-green-600 my-2">
                            {(result.coefficient * 100).toFixed(2)}%
                        </div>
                        <p className="font-medium text-xl">{result.relationship}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <KoalaCard koala={koalaMap.get(selectedA)!} />
                        <KoalaCard koala={koalaMap.get(selectedB)!} />
                    </div>

                    {result.commonAncestors.length > 0 && (
                        <div className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-lg">
                            <h3 className="font-bold mb-2 text-sm text-gray-500 uppercase">共通の祖先</h3>
                            <div className="flex flex-wrap gap-2">
                                {result.commonAncestors.map(id => {
                                    const ancestor = koalaMap.get(id);
                                    return (
                                        <span key={id} className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                                            {ancestor?.name || id}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
