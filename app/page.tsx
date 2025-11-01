import { Metadata } from 'next';
import Navbar from '@/components/navbar';
import Hero from '@/components/hero';
import FeatureCards from '@/components/feature-cards';
import ToolsSection from '@/components/tools-section';
import FeedbackSection from '@/components/feedback-section';

export const metadata: Metadata = {
  title: 'MiniMax2 - 专业的 AI 视频和图像生成平台',
  description: '免费在线 AI 内容创作工具，支持 Hailuo 2.3 视频生成、MiniMax M2 智能对话、AI 图像生成。一站式 AI 创作平台，让创意触手可及。',
  keywords: ['AI视频生成', 'AI图像生成', 'AI对话', 'MiniMax', 'Hailuo 2.3', '免费AI工具'],
  openGraph: {
    title: 'MiniMax2 - 专业的 AI 视频和图像生成平台',
    description: '免费在线 AI 内容创作工具，支持视频生成、图像生成、AI 对话',
    url: 'https://minimax2.pages.dev',
  },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Navbar />
      <Hero />
      <FeatureCards />
      <ToolsSection />
      <FeedbackSection />
    </main>
  );
}
