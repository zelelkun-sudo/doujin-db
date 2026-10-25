"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import SampleViewerModal from "@/components/SampleViewerModal";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function HomePage() {
  const [works, setWorks] = useState<any[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [excludeNtr, setExcludeNtr] = useState<boolean>(true); // デフォルトで地雷(NTR)除外ON
  const [activeWork, setActiveWork] = useState<any | null>(null);

  useEffect(() => {
    async function fetchWorks() {
      const { data } = await supabase
        .from("works")
        .select("*")
        .order("created_at", { ascending: false });
      if (data) setWorks(data);
    }
    fetchWorks();
  }, []);

  // 全作品から人気の性癖タグ一覧を自動抽出
  const allTags = Array.from(new Set(works.flatMap((w) => w.fetish_tags || []))).slice(0, 15);

  // タグ絞り込み＆地雷除外のリアルタイムフィルタリング
  const filteredWorks = works.filter((w) => {
    if (selectedTag && !w.fetish_tags?.includes(selectedTag)) return false;
    if (excludeNtr && w.ng_tags?.includes("NTR")) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* ヘッダー */}
      <header className="sticky top-0 z-30 border-b border-zinc-800 bg-zinc-950/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h1 className="text-lg font-extrabold tracking-tight text-white">
            🔥 同人厳選データベース
          </h1>
          {/* 地雷除外トグルスイッチ */}
          <button
            onClick={() => setExcludeNtr(!excludeNtr)}
            className={`rounded-full px-3 py-1 text-xs font-bold transition ${excludeNtr
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                : "bg-zinc-800 text-zinc-400"
              }`}
          >
            {excludeNtr ? "🛡️ NTR除外：ON" : "NTR除外：OFF"}
          </button>
        </div>

        {/* 横スクロール・性癖タグフィルター */}
        <div className="mx-auto mt-3 flex max-w-5xl gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => setSelectedTag(null)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${selectedTag === null ? "bg-pink-600 text-white" : "bg-zinc-800 text-zinc-300"
              }`}
          >
            すべて表示
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${selectedTag === tag ? "bg-pink-600 text-white" : "bg-zinc-800 text-zinc-300"
                }`}
            >
              #{tag}
            </button>
          ))}
        </div>
      </header>

      {/* 作品一覧グリッド */}
      <main className="mx-auto max-w-5xl px-4 py-6">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {filteredWorks.map((work) => (
            <div
              key={work.id}
              onClick={() => setActiveWork(work)}
              className="group cursor-pointer overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 transition hover:border-pink-500/50"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-zinc-800">
                <img
                  src={work.thumbnail_url}
                  alt={work.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
                {work.discount_rate > 0 && (
                  <span className="absolute left-2 top-2 rounded bg-rose-600 px-2 py-0.5 text-xs font-extrabold text-white shadow">
                    {work.discount_rate}%OFF
                  </span>
                )}
                <span className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-1 text-[11px] font-bold text-pink-400">
                  📖 サンプル {work.sample_image_urls?.length || 0}枚を読む
                </span>
              </div>

              <div className="p-3">
                <p className="truncate text-[11px] text-zinc-400">{work.circle_name}</p>
                <h2 className="mt-0.5 line-clamp-2 text-xs font-bold leading-snug text-zinc-100">
                  {work.title}
                </h2>
                <div className="mt-2 flex flex-wrap gap-1">
                  {work.fetish_tags?.slice(0, 3).map((t: string) => (
                    <span key={t} className="rounded bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-300">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* タップ時に開くサンプル立ち読みモーダル */}
      {activeWork && (
        <SampleViewerModal
          work={{
            title: activeWork.title,
            circleName: activeWork.circle_name,
            sampleImages: activeWork.sample_image_urls || [],
            totalPageCount: activeWork.page_count || 35,
            price: activeWork.price,
            salePrice: activeWork.sale_price,
            discountRate: activeWork.discount_rate,
            aiSummary: activeWork.ai_summary_3lines || [],
            fetishTags: activeWork.fetish_tags || [],
            fanzaUrl: activeWork.fanza_aff_url,
          }}
          onClose={() => setActiveWork(null)}
        />
      )}
    </div>
  );
}