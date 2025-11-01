'use client';

import { useState } from 'react';
import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // 移除 data:image/...;base64, 前缀
      const base64 = base64String.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function GenerateImagePage() {
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('请输入提示词');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          ...(imageFile && { image: await convertFileToBase64(imageFile) })
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '生成失败');
      }

      // 从响应中提取图像数据
      if (data.imageUrl) {
        setGeneratedImage(data.imageUrl);
      } else if (data.images && data.images[0]) {
        setGeneratedImage(`data:image/png;base64,${data.images[0]}`);
      } else {
        throw new Error('未返回图像数据');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const a = document.createElement('a');
      a.href = generatedImage;
      a.download = 'generated-image.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-1 mb-4">
            <span className="text-sm font-medium text-blue-400">Automation OUICC</span>
          </div>
          <h1 className="text-4xl font-bold sm:text-5xl mb-4">
            Generate & Edit Images
          </h1>
          <p className="text-lg text-gray-400">
            使用 AI 完美地创建或修改你的图像。
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Column - Upload & Input */}
          <div className="space-y-6">
            {/* Upload Section */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  上传图片 (拖拽、点击、最多4张)
                </h3>

                <div
                  className="relative border-2 border-dashed border-slate-600 rounded-lg p-12 text-center hover:border-purple-500 transition-colors cursor-pointer"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <input
                    type="file"
                    id="file-upload"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mx-auto max-h-48 rounded-lg"
                    />
                  ) : (
                    <>
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-slate-700">
                        <svg
                          className="h-8 w-8 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <p className="mb-2 text-sm font-medium text-gray-300">
                        选择文件或拖拽此处
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, WEBP, 最大 10MB
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Prompt Section */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">提示词 (Prompt)</h3>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="例如：一只在夕阳下奔跑的狗，具有自然真实的质感..."
                  className="w-full h-32 rounded-lg border border-slate-600 bg-slate-900 px-4 py-3 text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 resize-none"
                  disabled={isGenerating}
                />
                <p className="mt-2 text-sm text-gray-500">
                  {prompt.length} / 500 字符
                </p>

                {error && (
                  <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/20 p-4">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Actions & Result */}
          <div className="space-y-6">
            {/* Actions */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">操作</h3>

                <div className="space-y-3">
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-medium"
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
                        生成图像中...
                      </span>
                    ) : (
                      '生成图像'
                    )}
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-blue-500 text-blue-400 hover:bg-blue-500/10 py-6"
                  >
                    编辑图像
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Result */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">结果</h3>

                <div className="aspect-square rounded-lg bg-slate-900 flex items-center justify-center overflow-hidden">
                  {generatedImage ? (
                    <img
                      src={generatedImage}
                      alt="Generated"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-slate-800">
                        <svg
                          className="h-8 w-8 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-500">
                        {isGenerating ? '图像生成中...' : '返回图示'}
                      </p>
                    </div>
                  )}
                </div>

                {generatedImage && (
                  <div className="mt-4 flex gap-3">
                    <Button
                      onClick={handleDownload}
                      className="flex-1 bg-slate-700 hover:bg-slate-600"
                    >
                      下载图像
                    </Button>
                    <Button
                      onClick={() => setGeneratedImage(null)}
                      variant="outline"
                      className="flex-1 border-slate-600 hover:bg-slate-700"
                    >
                      重新生成
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
