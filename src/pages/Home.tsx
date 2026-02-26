import { useState, useMemo, useRef, useEffect } from 'react';
import { useKoalas } from '../context/KoalaContext';
import FamilyTreeGraph from '../components/FamilyTreeGraph';
import { Search, Loader2, X } from 'lucide-react';
import type { Koala } from '../types';

export default function Home() {
    const { koalas, loading } = useKoalas();
    const [search, setSearch] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedKoala, setSelectedKoala] = useState<Koala | null>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    const suggestions = useMemo(() => {
        if (!search) return [];
        return koalas.filter(k =>
            k.name.includes(search) ||
            k.zoo.includes(search) ||
            k.id.includes(search)
        ).slice(0, 10);
    }, [koalas, search]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (koala: Koala) => {
        setSelectedKoala(koala);
        setSearch(koala.name);
        setShowSuggestions(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-koala-green" />
            </div>
        );
    }

    return (
        <div className="p-4 max-w-2xl mx-auto space-y-6 min-h-[calc(100vh-4rem)]">
            {/* Search Section */}
            <div className="relative" ref={searchRef}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    コアラの名前を入力
                </label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="例: だいふく"
                        className="w-full pl-10 pr-10 py-3 rounded-lg border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-sm p-3 border focus:ring-2 focus:ring-koala-green focus:border-koala-green outline-none transition-all"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setShowSuggestions(true);
                            if (!e.target.value) setSelectedKoala(null);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                    />
                    {search && (
                        <button
                            onClick={() => { setSearch(''); setSelectedKoala(null); }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-zinc-700 transition-all flex items-center justify-center"
                            title="クリア"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                        {suggestions.map(k => (
                            <div
                                key={k.id}
                                className="p-3 hover:bg-gray-50 dark:hover:bg-zinc-700 cursor-pointer border-b last:border-b-0 border-gray-100 dark:border-zinc-700 flex justify-between items-center"
                                onClick={() => handleSelect(k)}
                            >
                                <div>
                                    <span className="font-bold text-gray-800 dark:text-gray-200">{k.name}</span>
                                    <span className="ml-2 text-xs text-gray-500">{k.id}</span>
                                </div>
                                <span className="text-xs text-gray-400">{k.zoo}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Selected Koala Detail & Tree */}
            {selectedKoala && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white dark:bg-zinc-800 p-6 rounded-xl shadow-sm border-l-4 border-koala-green">
                        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                            {selectedKoala.name}
                        </h2>
                        <div className="mt-2 flex flex-wrap gap-2 text-gray-600 dark:text-gray-300">
                            <span className={`px-2 py-0.5 rounded text-sm ${selectedKoala.gender === 'オス' ? 'bg-blue-50 text-blue-600' : 'bg-pink-50 text-pink-600'}`}>
                                {selectedKoala.gender}
                            </span>
                            <span className="bg-gray-100 dark:bg-zinc-700 px-2 py-0.5 rounded text-sm">
                                所属: {selectedKoala.zoo}動物園
                            </span>
                            {!selectedKoala.isAlive && (
                                <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded text-sm">
                                    🌈 {selectedKoala.death}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
                            家系図（3代）
                        </h3>
                        <div className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl overflow-hidden shadow-sm shadow-koala-green/10">
                            <FamilyTreeGraph centerId={selectedKoala.id} />
                        </div>
                    </div>
                </div>
            )}

            {!selectedKoala && !search && (
                <div className="py-12 text-center space-y-4">
                    <div className="text-6xl">🐨</div>
                    <div className="text-gray-500">
                        コアラの名前を入力して家系図を検索しましょう
                    </div>
                </div>
            )}
        </div>
    );
}
