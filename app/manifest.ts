import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'MiniMax2 - AI 视频和图像生成平台',
    short_name: 'MiniMax2',
    description: '基于 MiniMax API 的 AI 内容创作平台，支持 Hailuo 2.3 视频生成、图像生成、AI 对话等功能',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#9333ea',
    icons: [
      {
        src: '/logo.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
  };
}

