import type { Metadata } from 'next';
import { Noto_Sans_SC } from 'next/font/google';
import './globals.css';

// 使用 Noto Sans SC（思源黑体简体中文）- 专为简体中文优化
const notoSansSC = Noto_Sans_SC({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'MiniMax2 - AI 视频和图像生成平台',
  description: '基于 MiniMax API 的 AI 内容创作平台，支持视频生成、图像生成、AI 对话等功能',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={notoSansSC.className}>{children}</body>
    </html>
  );
}
