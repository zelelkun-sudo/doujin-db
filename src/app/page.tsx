import { createClient } from '@supabase/supabase-js';

// Supabaseクライアントの設定（環境変数を使うのがベストですが、まずは直接でもOKです）
const supabaseUrl = 'https://fsgxecznvvpajhkcdaad.supabase.co';
const supabaseKey = 'sb_publishable_IlAJbRtk3xDK3VB6nvwzhg_YnuF93va';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function Home() {
  // Supabaseの works テーブルからデータを取得（新しい順）
  const { data: works, error } = await supabase
    .from('works')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8">
      {/* ヘッダー */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-zinc-800 pb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-orange-500">
          🔥 同人厳選データベース
        </h1>
        <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
          <span className="text-xs bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-full border border-zinc-700">
            NTR除外: ON
          </span>
          <span className="text-xs bg-orange-500/10 text-orange-400 px-3 py-1.5 rounded-full border border-orange-500/20">
            #新着
          </span>
        </div>
      </header>

      {/* メイングリッド一覧 */}
      <main className="max-w-7xl mx-auto">
        {error && (
          <p className="text-red-500 text-center py-4">データの取得に失敗しました。</p>
        )}

        {/* グリッドレイアウト（スマホ1列、タブレット2〜3列、PC4列） */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {works && works.map((work) => (
            <div
              key={work.id || work.fanza_cid}
              className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all duration-300 flex flex-col group"
            >
              {/* サムネイル画像 */}
              <div className="relative aspect-[3/4] overflow-hidden bg-zinc-800">
                <img
                  src={work.thumbnail_url || "https://pics.dmm.co.jp/digital/doujin/dj2601/dj2601pl.jpg"}
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

                {/* FANZAリンク */}
                <a
                  href={work.fanza_aff_url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold py-2 rounded-lg text-center transition-colors shadow-lg shadow-orange-900/20"
                >
                  FANZAで見る
                </a>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}