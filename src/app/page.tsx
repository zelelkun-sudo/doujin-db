export default async function Home() {
  // Supabaseからデータを取得する処理（例）
  // const { data: works } = await supabase.from('works').select('*').order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8">
      {/* ヘッダー */}
      <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-zinc-800 pb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2 text-orange-500">
          🔥 同人厳選データベース
        </h1>
        {/* フィルターやタグエリア */}
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
      <main className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* ※ ここをSupabaseからのループ(Works.map)に置き換えます */}

        {/* サンプルカード（デザイン確認用） */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all duration-300 flex flex-col group">
          {/* サムネイル画像エリア */}
          <div className="relative aspect-[3/4] overflow-hidden bg-zinc-800">
            <img
              src="https://pics.dmm.co.jp/digital/doujin/dj2601/dj2601pl.jpg"
              alt="作品サムネイル"
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md text-orange-400 text-xs font-bold px-2 py-1 rounded-md">
              ¥1,980
            </div>
          </div>

          {/* テキスト情報エリア */}
          <div className="p-4 flex flex-col flex-grow">
            <div className="text-xs text-zinc-400 mb-1 truncate">サークル名 / 作者</div>
            <h2 className="font-bold text-sm line-clamp-2 mb-3 group-hover:text-orange-400 transition-colors">
              夏風にめくられて（作品タイトルのサンプル）
            </h2>

            {/* タグ一覧 */}
            <div className="flex flex-wrap gap-1 mb-4 mt-auto">
              <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
                #API自動取得
              </span>
              <span className="text-[10px] bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
                #新着
              </span>
            </div>

            {/* リンクボタン */}
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold py-2 rounded-lg text-center transition-colors shadow-lg shadow-orange-900/20"
            >
              FANZAで見る
            </a>
          </div>
        </div>
        {/* ループここまで */}

      </main>
    </div>
  );
}