import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const supabaseUrl = 'https://fsgxecznvvpajhkcdaad.supabase.co';
const supabaseKey = 'sb_publishable_IlAJbRtk3xDK3VB6nvwzhg_YnuF93va';
const supabase = createClient(supabaseUrl, supabaseKey);

// 静的エクスポート（ビルド用）のIDリスト生成
export async function generateStaticParams() {
    const { data: works } = await supabase.from('works').select('fanza_cid');

    if (!works) return [];

    return works.map((work) => ({
        cid: work.fanza_cid,
    }));
}

export default async function WorkDetailPage({
    params,
}: {
    params: Promise<{ cid: string }>;
}) {
    const { cid } = await params;

    // 該当する作品データをSupabaseから取得
    const { data: work, error } = await supabase
        .from('works')
        .select('*')
        .eq('fanza_cid', cid)
        .single();

    if (error || !work) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-12">
            <div className="max-w-4xl mx-auto">
                {/* 戻るリンク */}
                <Link href="/" className="text-sm text-zinc-400 hover:text-orange-400 transition-colors mb-6 inline-block">
                    ← 一覧に戻る
                </Link>

                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8">
                    {/* 左側：サムネイル画像 */}
                    <div className="w-full md:w-1/3 flex-shrink-0">
                        <div className="aspect-[3/4] rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700">
                            <img src={work.thumbnail_url} alt={work.title} className="w-full h-full object-cover" />
                        </div>
                    </div>

                    {/* 右側：詳細情報 */}
                    <div className="flex flex-col flex-grow">
                        <div className="text-sm text-orange-400 font-semibold mb-2">
                            {work.circle_name || "不明サークル"}
                        </div>

                        <h1 className="text-xl md:text-2xl font-bold mb-4 leading-snug">
                            {work.title}
                        </h1>

                        <div className="text-2xl font-extrabold text-zinc-100 mb-6">
                            ¥{work.price?.toLocaleString() || 0}
                        </div>

                        {/* AI 3行まとめや説明文 */}
                        <div className="bg-zinc-950/50 border border-zinc-800/80 rounded-xl p-4 mb-6">
                            <h2 className="text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">AI レビュー・まとめ</h2>
                            <ul className="text-sm text-zinc-300 space-y-1">
                                {work.ai_summary_3lines?.map((line: string, index: number) => (
                                    <li key={index}>・{line}</li>
                                ))}
                            </ul>
                        </div>

                        {/* タグ一覧 */}
                        <div className="flex flex-wrap gap-2 mb-8">
                            {work.fetish_tags?.map((tag: string, index: number) => (
                                <span key={index} className="text-xs bg-zinc-800 text-zinc-300 px-3 py-1 rounded-md border border-zinc-700">
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        {/* 外部リンクボタン */}
                        <a
                            href={work.fanza_aff_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-auto bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 px-6 rounded-xl text-center transition-colors shadow-lg shadow-orange-900/30"
                        >
                            FANZAで詳細を見る ↗
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}