import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Hero() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          Create Better AI Content
          <br />
          with{' '}
          <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
            minimaxm2
          </span>
        </h1>

        <p className="mt-6 text-lg text-gray-600 sm:text-xl">
          AI Agent、图像生成、视频创作 - 一站式 AI 创作平台
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/minimaxm2">
            <Button
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg font-medium rounded-lg"
            >
              MiniMax Agent
            </Button>
          </Link>
          <Link href="/generate-image">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-purple-200 text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg font-medium rounded-lg"
            >
              Generate Images
            </Button>
          </Link>
          <Link href="/image-to-prompt">
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-purple-200 text-purple-600 hover:bg-purple-50 px-8 py-6 text-lg font-medium rounded-lg"
            >
              Image to Prompt
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
