import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Koala } from '../types';
import { fetchKoalaData } from '../data/koalaData';

interface KoalaContextType {
    koalas: Koala[];
    koalaMap: Map<string, Koala>;
    loading: boolean;
    error: Error | null;
}

const KoalaContext = createContext<KoalaContextType | undefined>(undefined);

export function KoalaProvider({ children }: { children: ReactNode }) {
    const [koalas, setKoalas] = useState<Koala[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [koalaMap, setKoalaMap] = useState<Map<string, Koala>>(new Map());

    useEffect(() => {
        fetchKoalaData()
            .then((data) => {
                setKoalas(data);
                const map = new Map<string, Koala>();
                data.forEach(k => map.set(k.id, k));
                setKoalaMap(map);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError(err);
                setLoading(false);
            });
    }, []);

    return (
        <KoalaContext.Provider value={{ koalas, koalaMap, loading, error }}>
            {children}
        </KoalaContext.Provider>
    );
}

export function useKoalas() {
    const context = useContext(KoalaContext);
    if (context === undefined) {
        throw new Error('useKoalas must be used within a KoalaProvider');
    }
    return context;
}
