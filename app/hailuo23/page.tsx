'use client';

import { useState } from 'react';
import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

type GenerationMode = 'text' | 'image';
type ModelType = 'MiniMax-Hailuo-2.3' | 'MiniMax-Hailuo-2.3-fast';
type CameraCommand =
  | '[Truck left]' | '[Truck right]'
  | '[Pan left]' | '[Pan right]'
  | '[Push in]' | '[Pull out]'
  | '[Pedestal up]' | '[Pedestal down]'
  | '[Tilt up]' | '[Tilt down]'
  | '[Zoom in]' | '[Zoom out]'
  | '[Shake]'
  | '[Tracking shot]'
  | '[Static shot]';

export default function Hailuo23Page() {
  const [mode, setMode] = useState<GenerationMode>('text');
  const [prompt, setPrompt] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelType>('MiniMax-Hailuo-2.3');
  const [duration, setDuration] = useState<6 | 10>(6);
  const [resolution, setResolution] = useState<'720P' | '1080P'>('1080P');
  const [selectedCamera, setSelectedCamera] = useState<CameraCommand | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);

  const cameraCommands: { category: string; commands: CameraCommand[] }[] = [
    { category: 'Truck', commands: ['[Truck left]', '[Truck right]'] },
    { category: 'Pan', commands: ['[Pan left]', '[Pan right]'] },
    { category: 'Push', commands: ['[Push in]', '[Pull out]'] },
    { category: 'Pedestal', commands: ['[Pedestal up]', '[Pedestal down]'] },
    { category: 'Tilt', commands: ['[Tilt up]', '[Tilt down]'] },
    { category: 'Zoom', commands: ['[Zoom in]', '[Zoom out]'] },
    { category: 'Special', commands: ['[Shake]', '[Tracking shot]', '[Static shot]'] },
  ];

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
    if (mode === 'text' && !prompt.trim()) {
      setError('请输入视频描述');
      return;
    }
    if (mode === 'image' && !imageFile) {
      setError('请上传图片');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setVideoUrl(null);
    setTaskId(null);

    try {
      const formData = new FormData();

      // 构建完整的 prompt (包含相机指令)
      let fullPrompt = prompt;
      if (selectedCamera) {
        fullPrompt = `${selectedCamera} ${prompt}`;
      }

      formData.append('prompt', fullPrompt);
      formData.append('model', selectedModel);
      formData.append('duration', duration.toString());
      formData.append('resolution', resolution);

      if (mode === 'image' && imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch('/api/hailuo23/generate', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '生成失败');
      }

      // 保存任务 ID 并开始轮询
      setTaskId(data.task_id);
      pollTaskStatus(data.task_id);

    } catch (err) {
      setError(err instanceof Error ? err.message : '生成失败，请重试');
      setIsGenerating(false);
    }
  };

  const pollTaskStatus = async (taskId: string) => {
    const maxAttempts = 180; // 最多轮询 3 分钟 (每秒一次)
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(`/api/hailuo23/status?task_id=${taskId}`);
        const data = await response.json();

        if (data.status === 'Success') {
          setVideoUrl(data.video_url);
          setIsGenerating(false);
        } else if (data.status === 'Failed') {
          throw new Error('视频生成失败');
        } else if (attempts < maxAttempts) {
          attempts++;
          setTimeout(poll, 1000);
        } else {
          throw new Error('生成超时，请重试');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取状态失败');
        setIsGenerating(false);
      }
    };

    poll();
  };

  const handleDownload = () => {
    if (videoUrl) {
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = `hailuo23-video-${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Transform <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Idea to Visual</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            使用 Hailuo 2.3 AI 模型，将文字或图片转化为高质量视频内容
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
            <button
              onClick={() => {
                setMode('text');
                // 文字模式不支持 Fast 模型，自动切换
                if (selectedModel === 'MiniMax-Hailuo-2.3-fast') {
                  setSelectedModel('MiniMax-Hailuo-2.3');
                }
              }}
              className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all ${
                mode === 'text'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📝 文字转视频
            </button>
            <button
              onClick={() => setMode('image')}
              className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all ${
                mode === 'image'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🖼️ 图片转视频
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Column - Input & Settings */}
          <div className="space-y-6">
            {/* Main Input Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  {mode === 'text' ? '📝 输入视频描述' : '🖼️ 上传参考图片'}
                </h3>

                {mode === 'text' ? (
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="例如：A mouse runs toward the camera, smiling and blinking."
                    className="w-full h-32 rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none"
                    disabled={isGenerating}
                  />
                ) : (
                  <div>
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      {imagePreview ? (
                        <div className="relative w-full aspect-video">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-contain rounded-lg"
                          />
                        </div>
                      ) : (
                        <div>
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
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
                          <p className="mt-2 text-sm text-gray-600">点击上传图片</p>
                        </div>
                      )}
                    </div>
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={isGenerating}
                    />

                    <div className="mt-4">
                      <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="描述视频动作和场景 (可选)"
                        className="w-full h-20 rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none"
                        disabled={isGenerating}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Camera Commands */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  🎥 相机运镜指令
                </h3>
                <div className="space-y-3">
                  {cameraCommands.map((group) => (
                    <div key={group.category}>
                      <p className="text-sm font-medium text-gray-700 mb-2">{group.category}</p>
                      <div className="flex flex-wrap gap-2">
                        {group.commands.map((cmd) => (
                          <button
                            key={cmd}
                            onClick={() => setSelectedCamera(selectedCamera === cmd ? null : cmd)}
                            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                              selectedCamera === cmd
                                ? 'bg-purple-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            disabled={isGenerating}
                          >
                            {cmd.replace(/[\[\]]/g, '')}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">⚙️ 生成设置</h3>

                <div className="space-y-4">
                  {/* Model Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      模型选择
                    </label>
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value as ModelType)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                      disabled={isGenerating}
                    >
                      <option value="MiniMax-Hailuo-2.3">Hailuo 2.3 (高质量)</option>
                      {mode === 'image' && (
                        <option value="MiniMax-Hailuo-2.3-fast">Hailuo 2.3 Fast (快速，仅限图片转视频)</option>
                      )}
                    </select>
                    {mode === 'text' && (
                      <p className="mt-2 text-xs text-gray-500">
                        💡 Fast 模型仅支持图片转视频
                      </p>
                    )}
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      视频时长: {duration}秒
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setDuration(6)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                          duration === 6
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        disabled={isGenerating}
                      >
                        6秒
                      </button>
                      <button
                        onClick={() => {
                          // MiniMax-Hailuo-2.3 不支持 10秒 + 1080P 组合，应切换到 720P
                          if (selectedModel === 'MiniMax-Hailuo-2.3' && resolution === '1080P') {
                            setResolution('720P');
                          }
                          setDuration(10);
                        }}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                          duration === 10
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        disabled={isGenerating}
                      >
                        10秒
                      </button>
                    </div>
                    {selectedModel === 'MiniMax-Hailuo-2.3' && duration === 10 && (
                      <p className="mt-2 text-xs text-amber-600">
                        ⚠️ Hailuo 2.3 的 10秒模式仅支持 720P
                      </p>
                    )}
                  </div>

                  {/* Resolution */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      分辨率
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setResolution('720P')}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                          resolution === '720P'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        disabled={isGenerating}
                      >
                        720P
                      </button>
                      <button
                        onClick={() => {
                          // MiniMax-Hailuo-2.3 不支持 10秒 + 1080P 组合
                          if (selectedModel === 'MiniMax-Hailuo-2.3' && duration === 10) {
                            setDuration(6);
                          }
                          setResolution('1080P');
                        }}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                          resolution === '1080P'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        disabled={isGenerating || (selectedModel === 'MiniMax-Hailuo-2.3' && duration === 10)}
                      >
                        1080P
                        {selectedModel === 'MiniMax-Hailuo-2.3' && duration === 10 && ' (不可用)'}
                      </button>
                    </div>
                    {selectedModel === 'MiniMax-Hailuo-2.3' && resolution === '1080P' && duration === 10 && (
                      <p className="mt-2 text-xs text-amber-600">
                        ⚠️ 1080P 已自动切换，因为 Hailuo 2.3 不支持 10秒+1080P
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-500">
                      💡 推荐：快速预览使用 720P，最终成品使用 1080P
                    </p>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 rounded-lg bg-red-50 p-4">
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || (mode === 'text' && !prompt.trim()) || (mode === 'image' && !imageFile)}
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
                    '✨ 生成视频'
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preview */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  🎬 视频预览
                </h3>

                <div className="aspect-video rounded-lg bg-gray-900 flex items-center justify-center overflow-hidden">
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
                    <div className="text-center text-white">
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
                      <p className="mt-4 text-sm text-gray-400">
                        {isGenerating
                          ? '视频生成中，预计需要 1-2 分钟...'
                          : '生成的视频将在这里显示'}
                      </p>
                      {taskId && (
                        <p className="mt-2 text-xs text-gray-500">
                          任务 ID: {taskId}
                        </p>
                      )}
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
                        setImageFile(null);
                        setImagePreview(null);
                        setSelectedCamera(null);
                        setTaskId(null);
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

            {/* Tips */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h4 className="font-medium text-gray-900 mb-3">💡 使用提示</h4>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• 文字转视频：描述越详细，生成效果越好</li>
                  <li>• 图片转视频：支持 JPG、PNG 等常见格式</li>
                  <li>• 相机运镜：选择合适的运镜指令可增强视频效果</li>
                  <li>• 生成时间：通常需要 1-2 分钟，请耐心等待</li>
                  <li>• 分辨率：1080P 质量更高但生成时间更长</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
