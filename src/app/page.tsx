"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

type SampleViewerModalProps = {
  work: {
    title: string;
    circleName: string;
    sampleImages: string[];
    totalPageCount: number;
    price?: number;
    salePrice?: number;
    discountRate?: number;
    aiSummary: string[];
    fetishTags: string[];
    fanzaUrl?: string;
  };
  onClose: () => void;
};

function SampleViewerModal({ work, onClose }: SampleViewerModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <section
        className="mx-auto my-8 max-w-3xl rounded-xl border border-zinc-700 bg-zinc-900 p-4 text-zinc-100"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={work.title}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs text-zinc-400">{work.circleName}</p>
            <h2 className="text-lg font-bold">{work.title}</h2>
            <p className="mt-1 text-sm text-zinc-400">
              {work.salePrice ?? work.price}円 ・ 全{work.totalPageCount}ページ
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-zinc-800 px-3 py-1 text-sm hover:bg-zinc-700"
            aria-label="閉じる"
          >
            閉じる
          </button>
        </div>
        {work.aiSummary.length > 0 && (
          <ul className="mb-4 list-inside list-disc text-sm text-zinc-300">
            {work.aiSummary.map((summary, index) => (
              <li key={`${summary}-${index}`}>{summary}</li>
            ))}
          </ul>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          {work.sampleImages.map((image, index) => (
            <img
              key={`${image}-${index}`}
              src={image}
              alt={`${work.title} サンプル ${index + 1}`}
              className="h-auto w-full rounded-lg object-contain"
            />
          ))}
        </div>
        {work.fanzaUrl && (
          <a
            href={work.fanzaUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-block rounded bg-pink-600 px-4 py-2 text-sm font-bold text-white hover:bg-pink-500"
          >
            作品ページを見る
          </a>
        )}
      </section>
    </div>
  );
}

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