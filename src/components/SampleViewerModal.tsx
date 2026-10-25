"use client";

import React, { useState } from "react";

type WorkProps = {
    title: string;
    circleName: string;
    sampleImages: string[];
    totalPageCount: number;
    price: number;
    salePrice?: number;
    discountRate?: number;
    aiSummary: string[];
    fetishTags: string[];
    fanzaUrl?: string;
    dlsiteUrl?: string;
};

export default function SampleViewerModal({ work, onClose }: { work: WorkProps; onClose: () => void }) {
    const [readProgress, setReadProgress] = useState(0);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - clientHeight <= 0) return;
        const progress = Math.min(100, Math.round((scrollTop / (scrollHeight - clientHeight)) * 100));
        setReadProgress(progress);
    };

    const remainingPages = Math.max(10, work.totalPageCount - work.sampleImages.length);

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-zinc-950/95 text-zinc-100 backdrop-blur-md">
            {/* 1. 上部ヘッダー（進行度バー付き） */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-800 bg-zinc-900/90 px-4 py-3">
                <div className="truncate pr-4">
                    <p className="text-xs text-pink-400 font-bold">{work.circleName}</p>
                    <h2 className="truncate text-sm font-semibold">{work.title}</h2>
                </div>
                <button
                    onClick={onClose}
                    className="shrink-0 rounded-full bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-700"
                >
                    ✕ 閉じる
                </button>
                <div
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-150"
                    style={{ width: `${readProgress}%` }}
                />
            </div>

            {/* 2. メインの縦スクロール・サンプルビューア領域 */}
            <div onScroll={handleScroll} className="flex-1 overflow-y-auto px-2 py-4 sm:px-6">
                <div className="mx-auto mb-6 max-w-xl rounded-xl border border-pink-500/30 bg-zinc-900/80 p-4 shadow-lg">
                    <span className="mb-2 inline-block rounded bg-pink-500/20 px-2 py-0.5 text-xs font-bold text-pink-400">
                        AI抽出：この作品の見どころ
                    </span>
                    <ul className="space-y-1.5 text-sm text-zinc-200">
                        {work.aiSummary.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                                <span className="text-pink-500">✔</span>
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                        {work.fetishTags.map((tag) => (
                            <span key={tag} className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-300">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* サンプル画像の連続縦スクロール表示 */}
                <div className="mx-auto max-w-xl space-y-2">
                    {work.sampleImages.map((imgUrl, index) => (
                        <div key={index} className="relative overflow-hidden rounded-lg bg-zinc-900">
                            <img
                                src={imgUrl}
                                alt={`サンプル ${index + 1}`}
                                loading="lazy"
                                className="w-full object-contain"
                            />
                            <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-[10px] text-zinc-400">
                                {index + 1} / {work.sampleImages.length}
                            </span>
                        </div>
                    ))}
                </div>

                {/* サンプル最後の1枚の直下に現れる購入ボタンエリア */}
                <div className="mx-auto mt-4 mb-24 max-w-xl rounded-2xl border-2 border-pink-500 bg-gradient-to-b from-zinc-900 to-zinc-950 p-6 text-center shadow-2xl">
                    <p className="text-xs font-bold uppercase tracking-wider text-pink-400">
                        無料サンプルはここまで
                    </p>
                    <h3 className="mt-2 text-lg font-extrabold text-white">
                        本編の続き（残り約 {remainingPages} ページ）を今すぐ読む！
                    </h3>
                    <p className="mt-1 text-xs text-zinc-400">
                        ※公式サイトでは高画質版・全ページが即時ダウンロード可能です
                    </p>

                    {work.discountRate && work.discountRate > 0 ? (
                        <div className="mt-4 inline-block rounded-lg bg-rose-500/20 px-4 py-1.5 text-sm font-bold text-rose-400 border border-rose-500/40">
                            🔥 現在 {work.discountRate}%OFF セール中！（¥{work.price} → ¥{work.salePrice}）
                        </div>
                    ) : null}

                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        {work.fanzaUrl && (
                            <a
                                href={work.fanzaUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-pink-600/30 hover:opacity-95"
                            >
                                FANZAで本編を読む ➔
                            </a>
                        )}
                        {work.dlsiteUrl && (
                            <a
                                href={work.dlsiteUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/30 hover:opacity-95"
                            >
                                DLsiteで本編を読む ➔
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* 3. スマホ下部固定の購入バー */}
            <div className="sticky bottom-0 z-20 flex items-center justify-between border-t border-zinc-800 bg-zinc-900/95 px-4 py-3 backdrop-blur">
                <div>
                    {work.discountRate ? (
                        <div className="flex items-baseline gap-1.5">
                            <span className="rounded bg-rose-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                -{work.discountRate}%
                            </span>
                            <span className="text-lg font-extrabold text-rose-400">¥{work.salePrice}</span>
                            <span className="text-xs text-zinc-500 line-through">¥{work.price}</span>
                        </div>
                    ) : (
                        <span className="text-lg font-extrabold text-white">¥{work.price}</span>
                    )}
                    <p className="text-[10px] text-zinc-400">本編 {work.totalPageCount}P / 即時閲覧可</p>
                </div>

                <div className="flex gap-2">
                    {work.fanzaUrl && (
                        <a
                            href={work.fanzaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-pink-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-pink-600/20"
                        >
                            FANZAへ
                        </a>
                    )}
                    {work.dlsiteUrl && (
                        <a
                            href={work.dlsiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20"
                        >
                            DLsiteへ
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}