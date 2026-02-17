import { useState, useMemo } from 'react';
import { useKoalas } from '../context/KoalaContext';
import { KoalaCard } from '../components/KoalaCard';
import { Search, Loader2 } from 'lucide-react';

export default function Home() {
    const { koalas, loading } = useKoalas();
    const [search, setSearch] = useState('');
    const [zooFilter, setZooFilter] = useState<string>('all');

    // Extract unique zoos
    const zoos = useMemo(() => {
        const list = Array.from(new Set(koalas.map(k => k.zoo).filter(Boolean)));
        return list.sort();
    }, [koalas]);

    const filteredKoalas = useMemo(() => {
        return koalas.filter(k => {
            const matchSearch = k.name.includes(search) || k.zoo.includes(search);
            const matchZoo = zooFilter === 'all' || k.zoo === zooFilter;
            return matchSearch && matchZoo;
        });
    }, [koalas, search, zooFilter]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            </div>
        );
    }

    return (
        <div className="p-4 max-w-4xl mx-auto space-y-6">
            <div className="flex float-right text-xs text-gray-500">
                登録数: {koalas.length}頭
            </div>

            {/* Search & Filter */}
            <div className="sticky top-0 bg-gray-50 dark:bg-zinc-900 pt-2 pb-4 z-10 space-y-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="名前や動物園で検索..."
                        className="w-full pl-9 pr-4 py-2 rounded-lg border bg-white dark:bg-zinc-800 dark:border-zinc-700 shadow-sm focus:ring-2 focus:ring-green-500 outline-none"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    <button
                        onClick={() => setZooFilter('all')}
                        className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors border ${zooFilter === 'all'
                                ? 'bg-green-600 text-white border-green-600'
                                : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-zinc-700'
                            }`}
                    >
                        全て
                    </button>

                    {zoos.map(zoo => (
                        <button
                            key={zoo}
                            onClick={() => setZooFilter(zoo)}
                            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors border ${zooFilter === zoo
                                    ? 'bg-green-600 text-white border-green-600'
                                    : 'bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-zinc-700'
                                }`}
                        >
                            {zoo}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            {filteredKoalas.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    見つかりませんでした 🐨
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredKoalas.map(k => (
                        <KoalaCard key={k.id} koala={k} />
                    ))}
                </div>
            )}
        </div>
    );
}
