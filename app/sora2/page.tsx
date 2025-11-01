'use client';

import { useState } from 'react';
import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Sora2Page() {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('请输入视频描述');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '生成失败');
      }

      // 从工作流结果中提取视频 URL
      if (data.data?.output) {
        const output = JSON.parse(data.data.output);
        setVideoUrl(output.video_url || output.url);
      } else if (data.videoUrl) {
        setVideoUrl(data.videoUrl);
      } else {
        throw new Error('未能获取视频 URL');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (videoUrl) {
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = 'sora2-video.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Sora2 AI 文生视频
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            通过 AI 将你的文字描述转化为精彩的视频内容
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Column - Input */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  输入视频描述
                </h3>

                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="例如：一只可爱的橘猫在阳光明媚的花园里追逐蝴蝶，画面温馨自然，4K高清..."
                  className="w-full h-48 rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none"
                  disabled={isGenerating}
                />

                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    {prompt.length} / 1000 字符
                  </p>
                </div>

                {error && (
                  <div className="mt-4 rounded-lg bg-red-50 p-4">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim()}
                  className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-medium"
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      生成中，请稍候...
                    </span>
                  ) : (
                    '生成视频'
                  )}
                </Button>

                {/* 提示信息 */}
                <div className="mt-6 rounded-lg bg-blue-50 p-4">
                  <h4 className="font-medium text-blue-900 mb-2">💡 使用提示</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• 尽可能详细地描述场景、动作和氛围</li>
                    <li>• 视频生成大约需要 1-2 分钟</li>
                    <li>• 建议描述长度在 50-500 字之间</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preview */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  视频预览
                </h3>

                <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                  {videoUrl ? (
                    <video
                      src={videoUrl}
                      controls
                      className="w-full h-full"
                      autoPlay
                      loop
                    >
                      您的浏览器不支持视频播放
                    </video>
                  ) : (
                    <div className="text-center">
                      <svg
                        className="mx-auto h-16 w-16 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="mt-4 text-sm text-gray-500">
                        {isGenerating
                          ? '视频生成中，请耐心等待...'
                          : '生成的视频将在这里显示'}
                      </p>
                    </div>
                  )}
                </div>

                {videoUrl && (
                  <div className="mt-6 flex gap-4">
                    <Button
                      onClick={handleDownload}
                      className="flex-1 bg-purple-600 hover:bg-purple-700"
                    >
                      <svg
                        className="mr-2 h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      下载视频
                    </Button>
                    <Button
                      onClick={() => {
                        setVideoUrl(null);
                        setPrompt('');
                      }}
                      variant="outline"
                      className="flex-1"
                    >
                      重新生成
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 示例提示词 */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h4 className="font-medium text-gray-900 mb-3">🎬 示例提示词</h4>
                <div className="space-y-2">
                  {[
                    '一只可爱的柴犬在公园里欢快地奔跑，阳光洒在草地上',
                    '科幻城市的未来景象，飞行汽车穿梭在摩天大楼之间',
                    '海边日落，海浪轻轻拍打着沙滩，天空呈现橙红色',
                  ].map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setPrompt(example)}
                      className="w-full text-left text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 p-3 rounded-lg transition-colors"
                      disabled={isGenerating}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">快速生成</h3>
              <p className="mt-2 text-sm text-gray-600">
                仅需 1-2 分钟即可生成高质量视频
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">高清画质</h3>
              <p className="mt-2 text-sm text-gray-600">
                支持 4K 分辨率，画面细腻流畅
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">智能理解</h3>
              <p className="mt-2 text-sm text-gray-600">
                AI 精准理解描述，生成符合预期的视频
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
