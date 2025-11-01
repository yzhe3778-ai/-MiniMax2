import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages 配置
  images: {
    unoptimized: true, // Cloudflare 不支持 Next.js Image Optimization
  },
  // 确保 API 路由正常工作
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;
