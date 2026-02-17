import { Link } from 'wouter';
import type { Koala } from '../types';
import { Mars, Venus, MapPin, Calendar } from 'lucide-react';
import { cn } from '../lib/utils';

interface KoalaCardProps {
    koala: Koala;
}

export function KoalaCard({ koala }: KoalaCardProps) {
    const isMale = koala.gender === 'オス';
    const isAlive = koala.isAlive;

    return (
        <Link href={`/koala/${koala.id}`} className="block transition-transform hover:scale-[1.02] active:scale-95">
            <div className={cn(
                "h-full p-4 rounded-xl border bg-white dark:bg-zinc-800 shadow-sm hover:shadow-md transition-shadow",
                "flex flex-col gap-2",
                !isAlive && "opacity-80 grayscale-[0.5]"
            )}>
                <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                        {koala.name}
                        {isMale ? (
                            <Mars className="w-4 h-4 text-blue-500" />
                        ) : (
                            <Venus className="w-4 h-4 text-pink-500" />
                        )}
                    </h3>
                    {!isAlive && (
                        <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-500 px-2 py-0.5 rounded-full">
                            🌈
                        </span>
                    )}
                </div>

                <div className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{koala.zoo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{koala.birthday} ({koala.age})</span>
                    </div>
                    {/* <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5" />
            <span>{koala.mother_name ? `母: ${koala.mother_name}` : '母不明'}</span>
          </div> */}
                </div>
            </div>
        </Link>
    );
}
