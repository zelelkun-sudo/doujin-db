import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // ← これがCloudflare Pagesに必須です！
  images: {
    unoptimized: true, // ← 外部画像を表示するために必要です
  },
};

export default nextConfig;