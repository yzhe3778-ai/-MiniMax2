import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MiniMax M2 AI 对话',
  description: 'MiniMax M2 智能对话助手，支持多轮对话、中英文交流、代码生成、创意写作等功能。免费在线使用，体验先进的 AI 对话技术。',
  keywords: [
    'MiniMax M2',
    'AI对话',
    '智能助手',
    'ChatGPT替代',
    'AI聊天',
    '代码生成',
    '创意写作',
  ],
  openGraph: {
    title: 'MiniMax M2 - AI 智能对话助手',
    description: '免费的 AI 对话助手，支持多轮对话和智能问答',
    url: 'https://minimax2.pages.dev/minimaxm2',
  },
};

export default function MinimaxM2Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

