import { useState } from 'react';
import { useKoalas } from '../context/KoalaContext';
import FamilyTreeGraph from '../components/FamilyTreeGraph';
import { Loader2, Archive } from 'lucide-react';
import KoalaSearchInput from '../components/KoalaSearchInput';
import type { Koala } from '../types';

export default function Home() {
    const { loading } = useKoalas();
    const [selectedKoala, setSelectedKoala] = useState<Koala | null>(null);

    const handleSelect = (koala: Koala) => {
        setSelectedKoala(koala);
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-koala-light">
                <Loader2 className="w-8 h-8 text-koala-base animate-spin" />
            </div>
        );
    }

    return (
        <div className="flex-grow flex flex-col px-5 pb-10">
            {/* Search Section */}
            <div className="mb-8 relative z-10">
                <KoalaSearchInput onSelect={handleSelect} placeholder="ファミリーツリーを見たいコアラを検索..." />
            </div>

            {/* Main Content Area */}
            {!selectedKoala ? (
                <div className="flex-grow flex items-center justify-center opacity-60">
                    <div className="text-center">
                        <Archive className="w-16 h-16 mx-auto text-gray-300 mb-4" strokeWidth={1.5} />
                        <p className="text-gray-500 font-medium">気になるコアラを検索してください</p>
                    </div>
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
                            <p className="text-[10px] text-gray-400 font-medium mb-1">🎂 {selectedKoala.birthday || '不明'}</p>
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
    );
}
