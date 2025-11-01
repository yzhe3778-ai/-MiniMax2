import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hailuo 2.3 视频生成',
  description: '使用 Hailuo 2.3 AI 模型生成高质量视频。支持文字转视频、图片转视频，15种专业相机运镜效果，支持768P/1080P分辨率。',
  keywords: [
    'Hailuo 2.3',
    'AI视频生成',
    '文字转视频',
    '图片转视频',
    'MiniMax视频',
    '相机运镜',
    'AI视频制作',
  ],
  openGraph: {
    title: 'Hailuo 2.3 - AI 视频生成工具',
    description: '专业的 AI 视频生成工具，支持文字转视频和图片转视频',
    url: 'https://minimax2.pages.dev/hailuo23',
  },
};

export default function Hailuo23Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

