import { Link, useRoute } from 'wouter';
import { useKoalas } from '../context/KoalaContext';
import FamilyTreeGraph from '../components/FamilyTreeGraph';
import { ArrowLeft } from 'lucide-react';

export default function FamilyTree() {
    const [, params] = useRoute('/tree/:id');
    const { koalaMap } = useKoalas();
    const id = params?.id;
    const koala = id ? koalaMap.get(id) : undefined;

    if (!id || !koala) {
        return (
            <div className="p-4 text-center">
                <p>コアラが選択されていません。</p>
                <Link href="/" className="text-green-600 hover:underline">一覧に戻る</Link>
            </div>
        );
    }

    return (
        <div className="p-4 h-full flex flex-col space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href={`/koala/${id}`} className="text-gray-500 hover:text-green-600">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        {koala.name} の家系図
                    </h1>
                </div>
            </div>

            <div className="flex-1 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-gray-200 dark:border-zinc-700 overflow-hidden" style={{ minHeight: '600px' }}>
                <FamilyTreeGraph centerId={id} />
            </div>

            <p className="text-xs text-gray-400 text-center">
                ※ 表示されているのは選択した個体を中心とした、親・祖父母（2世代）と子・孫（2世代）です。
            </p>
        </div>
    );
}
