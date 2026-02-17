import { useRoute, Link } from 'wouter';
import { useKoalas } from '../context/KoalaContext';
import { ArrowLeft, Mars, Venus } from 'lucide-react';

export default function Details() {
    const [, params] = useRoute('/koala/:id');
    const { koalaMap, koalas } = useKoalas();
    const id = params?.id;
    const koala = id ? koalaMap.get(id) : undefined;

    if (!koala) return <div className="p-4">見つかりません</div>;

    const father = koala.father_id ? koalaMap.get(koala.father_id) : null;
    const mother = koala.mother_id ? koalaMap.get(koala.mother_id) : null;

    const children = koalas.filter(k => k.mother_id === id || k.father_id === id);

    // Simple sibling logic (same mother OR same father)
    const siblings = koalas.filter(k =>
        k.id !== id && (
            (k.mother_id && k.mother_id === koala.mother_id) ||
            (k.father_id && k.father_id === koala.father_id)
        )
    );

    return (
        <div className="p-4 max-w-2xl mx-auto space-y-6 pb-20">
            <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-green-600 mb-2">
                <ArrowLeft className="w-4 h-4 mr-1" />
                戻る
            </Link>

            {/* Header Profile */}
            <div className="bg-white dark:bg-zinc-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-700">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h1 className="text-3xl font-bold flex items-center gap-2">
                            {koala.name}
                            {koala.gender === 'オス' ? <Mars className="text-blue-500" /> : <Venus className="text-pink-500" />}
                        </h1>
                        <p className="text-gray-500">{koala.zoo} 所属</p>
                    </div>
                    <div className="text-right">
                        <span className="block text-2xl font-mono font-bold text-green-600">{koala.age}</span>
                        <span className="text-xs text-gray-400">{koala.birthday} 生まれ</span>
                        {!koala.isAlive && <span className="block text-xs text-red-400 mt-1">🌈 {koala.death}</span>}
                    </div>
                </div>

                {koala.memo && (
                    <div className="bg-gray-50 dark:bg-zinc-900 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                        {koala.memo}
                    </div>
                )}
            </div>

            {/* Family Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Parents */}
                <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-sm border">
                    <h3 className="font-bold text-gray-500 dark:text-gray-400 mb-3 text-sm uppercase tracking-wide">両親</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">父</span>
                            {father ? (
                                <Link href={`/koala/${father.id}`} className="text-blue-600 hover:underline">{father.name}</Link>
                            ) : (
                                <span className="text-gray-300">{koala.father || '不明'}</span>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">母</span>
                            {mother ? (
                                <Link href={`/koala/${mother.id}`} className="text-pink-600 hover:underline">{mother.name}</Link>
                            ) : (
                                <span className="text-gray-300">{koala.mother || '不明'}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Children */}
                <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-sm border">
                    <h3 className="font-bold text-gray-500 dark:text-gray-400 mb-3 text-sm uppercase tracking-wide">
                        子供 ({children.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {children.length > 0 ? children.map(child => (
                            <Link key={child.id} href={`/koala/${child.id}`} className="px-2 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-sm hover:bg-green-100">
                                {child.name}
                            </Link>
                        )) : <span className="text-gray-300 text-sm">なし</span>}
                    </div>
                </div>
            </div>

            {/* Siblings */}
            <div className="bg-white dark:bg-zinc-800 rounded-xl p-4 shadow-sm border">
                <h3 className="font-bold text-gray-500 dark:text-gray-400 mb-3 text-sm uppercase tracking-wide">
                    きょうだい ({siblings.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                    {siblings.length > 0 ? siblings.map(sib => (
                        <Link key={sib.id} href={`/koala/${sib.id}`} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm hover:bg-gray-200">
                            {sib.name}
                        </Link>
                    )) : <span className="text-gray-300 text-sm">なし</span>}
                </div>
            </div>

        </div>
    );
}
