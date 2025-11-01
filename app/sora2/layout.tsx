import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sora2 AI 视频生成',
  description: 'Sora2 AI 文字转视频工具，通过 AI 将文字描述转化为精彩的视频内容。支持 4K 高清，快速生成，智能理解。',
  keywords: [
    'Sora2',
    'AI视频生成',
    '文字转视频',
    'OpenAI Sora',
    '视频制作',
    '4K视频',
    'AI创作',
  ],
  openGraph: {
    title: 'Sora2 - AI 文字转视频工具',
    description: '使用 Sora2 AI 将文字描述转化为精彩视频',
    url: 'https://minimax2.pages.dev/sora2',
  },
};

export default function Sora2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

