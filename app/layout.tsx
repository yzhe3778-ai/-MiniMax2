import type { Metadata } from 'next';
import { Noto_Sans_SC } from 'next/font/google';
import './globals.css';
import StructuredData from '@/components/structured-data';

// 使用 Noto Sans SC（思源黑体简体中文）- 专为简体中文优化
const notoSansSC = Noto_Sans_SC({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  metadataBase: new URL('https://minimax2.pages.dev'), // 部署后替换为你的实际域名
  title: {
    default: 'MiniMax2 - AI 视频和图像生成平台',
    template: '%s | MiniMax2',
  },
  description: '基于 MiniMax API 的专业 AI 内容创作平台。支持 Hailuo 2.3 文字转视频、图片转视频、MiniMax M2 智能对话、AI 图像生成等功能。免费在线使用，快速生成高质量 AI 内容。',
  keywords: [
    'AI视频生成',
    'Hailuo 2.3',
    'MiniMax',
    '文字转视频',
    '图片转视频',
    'AI对话',
    'AI图像生成',
    'Sora2',
    '人工智能',
    '内容创作',
    '视频制作',
    'AI工具',
  ],
  authors: [{ name: 'MiniMax2 Team' }],
  creator: 'MiniMax2',
  publisher: 'MiniMax2',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://minimax2.pages.dev',
    title: 'MiniMax2 - AI 视频和图像生成平台',
    description: '专业的 AI 内容创作平台，支持视频生成、图像生成、AI 对话等功能',
    siteName: 'MiniMax2',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'MiniMax2 AI Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MiniMax2 - AI 视频和图像生成平台',
    description: '专业的 AI 内容创作平台，支持视频生成、图像生成、AI 对话等功能',
    images: ['/logo.png'],
    creator: '@minimax2',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // 部署后在 Google Search Console 获取验证码并填写
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        <StructuredData />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5606984944198315"
          crossOrigin="anonymous"
        />
      </head>
      <body className={notoSansSC.className}>{children}</body>
    </html>
  );
}
