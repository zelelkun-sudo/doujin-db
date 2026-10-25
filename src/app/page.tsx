import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';

// ★追加：このページを動的レンダリングにする（静的エクスポート時のエラー回避）
export const dynamic = 'force-dynamic';

const supabaseUrl = 'https://fsgxecznvvpajhkcdaad.supabase.co';
const supabaseKey = 'sb_publishable_IlAJbRtk3xDK3VB6nvwzhg_YnuF93va';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const searchQuery = params.q || '';

  // データベースから作品を取得（検索ワードがある場合はタイトルやサークル名で絞り込み）
  let query = supabase.from('works').select('*').order('created_at', { ascending: false });

  if (searchQuery) {
    query = query.or(`title.ilike.%${searchQuery}%,circle_name.ilike.%${searchQuery}%`);
  }

  const { data: works, error } = await query;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8">
      {/* ヘッダー */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-zinc-800 pb-4 gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-orange-500">
          🔥 同人厳選データベース
        </h1>

        {/* 検索フォーム */}
        <form method="GET" className="w-full md:w-auto flex gap-2">
          <input
            type="text"
            name="q"
            defaultValue={searchQuery}
            placeholder="タイトルやサークル名で検索..."
            className="bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-orange-500 w-full md:w-80"
          />
          <button
            type="submit"
            className="bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors"
          >
            検索
          </button>
        </form>
      </header>

      {/* メイン一覧グリッド */}
      <main className="max-w-7xl mx-auto">
        {error && <p className="text-red-500 text-center py-4">データの取得に失敗しました。</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {works && works.map((work) => (
            <Link
              key={work.id || work.fanza_cid}
              href={`/works/${work.fanza_cid}`}
              className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 hover:scale-[1.02] transition-all duration-300 flex flex-col group"
            >
              {/* サムネイル */}
              <div className="relative aspect-[3/4] overflow-hidden bg-zinc-800">
                <img
                  src={work.thumbnail_url}
                  alt={work.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md text-orange-400 text-xs font-bold px-2 py-1 rounded-md">
                  ¥{work.price?.toLocaleString() || 0}
                </div>
              </div>

              {/* テキスト情報 */}
              <div className="p-4 flex flex-col flex-grow">
                <div className="text-xs text-zinc-400 mb-1 truncate">
                  {work.circle_name || "不明サークル"}
                </div>
                <h2 className="font-bold text-sm line-clamp-2 mb-3 group-hover:text-orange-400 transition-colors">
                  {work.title}
                </h2>

                {/* タグ */}
                <div className="flex flex-wrap gap-1 mb-4 mt-auto">
                  {work.fetish_tags && work.fetish_tags.map((tag: string, index: number) => (
                    <span key={index} className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>

                <span className="w-full bg-zinc-800 group-hover:bg-orange-600 text-zinc-300 group-hover:text-white text-xs font-bold py-2 rounded-lg text-center transition-colors">
                  詳細を見る
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}