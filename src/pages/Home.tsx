import { useState, useMemo, useRef, useEffect } from 'react';
import { useKoalas } from '../context/KoalaContext';
import FamilyTreeGraph from '../components/FamilyTreeGraph';
import { Search, Loader2, X, Archive } from 'lucide-react';
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
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-koala-base" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-10">
            {/* Header */}
            <header className="pt-10 pb-6 px-6 text-center">
                <h1 className="text-2xl font-bold text-koala-dark flex justify-center items-center gap-2">
                    <span className="text-3xl">🐨</span> コアラ家系図サーチ
                </h1>
                <p className="text-xs text-gray-500 mt-2">国内のコアラの繋がりを探してみよう</p>
            </header>

            <div className="px-5 space-y-8">
                {/* Search Bar */}
                <div className="relative z-20" ref={searchRef}>
                    <div className="flex items-center bg-white rounded-full shadow-md px-4 py-3 border border-gray-100 focus-within:ring-2 focus-within:ring-koala-base transition-all">
                        <Search className="w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            id="searchInput"
                            placeholder="コアラの名前を入力..."
                            className="w-full bg-transparent border-none outline-none ml-3 text-gray-700 placeholder-gray-400 text-lg"
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
                                className="p-1 rounded-full text-gray-300 hover:text-gray-500 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Suggestions Dropdown */}
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-16 left-0 w-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-30">
                            {suggestions.map((k, index) => (
                                <div
                                    key={k.id}
                                    className={`px-4 py-3 hover:bg-koala-light cursor-pointer transition-colors text-gray-700 ${index !== suggestions.length - 1 ? 'border-b border-gray-50' : ''} flex justify-between items-center`}
                                    onClick={() => handleSelect(k)}
                                >
                                    <span className="font-medium">{k.name}</span>
                                    <span className="text-xs text-gray-400">{k.zoo}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Main Content Area */}
                {!selectedKoala ? (
                    <div className="text-center py-12 opacity-60">
                        <Archive className="w-16 h-16 mx-auto text-gray-300 mb-4" strokeWidth={1.5} />
                        <p className="text-gray-500">気になるコアラを検索してください</p>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Info Card */}
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex items-center gap-5 relative overflow-hidden">
                            <div className="absolute -right-4 -top-4 w-20 h-20 bg-koala-light rounded-full opacity-50"></div>
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl font-bold flex-shrink-0 shadow-inner text-white ${selectedKoala.gender === 'オス' ? 'bg-koala-base' : 'bg-pink-400'}`}>
                                🐨
                            </div>
                            <div className="z-10">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    {selectedKoala.name}
                                </h2>
                                <div className="flex gap-2 mt-2">
                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] rounded-md leading-none flex items-center">
                                        {selectedKoala.zoo}動物公園
                                    </span>
                                    <span className="px-2 py-1 bg-koala-light text-koala-dark text-[10px] rounded-md font-bold leading-none flex items-center">
                                        {selectedKoala.gender}
                                    </span>
                                    {!selectedKoala.isAlive && (
                                        <span className="px-2 py-1 bg-red-50 text-red-500 text-[10px] rounded-md font-bold leading-none flex items-center">
                                            🌈 {selectedKoala.death}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tree Card */}
                        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 space-y-4">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path></svg>
                                Family Tree (3代)
                            </h3>
                            <div className="bg-gray-50 rounded-2xl border border-gray-50 overflow-hidden">
                                <FamilyTreeGraph centerId={selectedKoala.id} onSelect={handleSelect} />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
