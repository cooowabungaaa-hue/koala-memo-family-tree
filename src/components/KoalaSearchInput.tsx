import { useState, useMemo, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useKoalas } from '../context/KoalaContext';
import type { Koala } from '../types';

interface KoalaSearchInputProps {
    onSelect: (koala: Koala) => void;
    placeholder?: string;
    initialValue?: string;
    className?: string;
}

export default function KoalaSearchInput({ onSelect, placeholder, initialValue = '', className = '' }: KoalaSearchInputProps) {
    const { koalas } = useKoalas();
    const [search, setSearch] = useState(initialValue);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    const suggestions = useMemo(() => {
        if (!search) return [];
        return koalas.filter(k =>
            k.name.includes(search) ||
            k.zoo.includes(search) ||
            k.id.includes(search)
        ).slice(0, 5);
    }, [koalas, search]);

    useEffect(() => {
        setSearch(initialValue);
    }, [initialValue]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleItemClick = (koala: Koala) => {
        setSearch(koala.name);
        onSelect(koala);
        setShowSuggestions(false);
    };

    return (
        <div className={`relative ${className}`} ref={searchRef}>
            <div className="flex items-center bg-white rounded-full shadow-md px-4 py-3 border border-gray-100 focus-within:ring-2 focus-within:ring-koala-base transition-all">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    placeholder={placeholder || "コアラの名前を入力..."}
                    className="w-full bg-transparent border-none outline-none ml-3 text-gray-700 placeholder-gray-400 text-lg"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                />
                {search && (
                    <button
                        onClick={() => { setSearch(''); }}
                        className="p-1 rounded-full text-gray-300 hover:text-gray-500 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-16 left-0 w-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-30">
                    {suggestions.map((k, index) => (
                        <div
                            key={k.id}
                            className={`px-4 py-3 hover:bg-koala-light cursor-pointer transition-colors text-gray-700 ${index !== suggestions.length - 1 ? 'border-b border-gray-50' : ''} flex justify-between items-center`}
                            onClick={() => handleItemClick(k)}
                        >
                            <span className="font-medium text-sm">{k.name}</span>
                            <span className="text-[10px] text-gray-400">{k.zoo}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
