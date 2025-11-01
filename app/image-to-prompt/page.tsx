'use client';

import { useState } from 'react';
import Navbar from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ImageToPromptPage() {
  const [activeTab, setActiveTab] = useState<'image' | 'text'>('image');
  const [selectedModel, setSelectedModel] = useState('general');
  const [uploadMethod, setUploadMethod] = useState<'upload' | 'url'>('upload');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const aiModels = [
    {
      id: 'general',
      name: 'General Image Prompt',
      description: 'Natural language description of the image',
    },
    {
      id: 'flux',
      name: 'Flux',
      description: 'Optimized for state-of-the-art Flux AI models, concise natural language',
    },
    {
      id: 'midjourney',
      name: 'Midjourney',
      description: 'Tailored for Midjourney generation with Midjourney parameters',
    },
    {
      id: 'stable-diffusion',
      name: 'Stable Diffusion',
      description: 'Formatted for Stable Diffusion models',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Free Image to Prompt Generator
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Convert Image to Prompt to generate your own image
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
            <button
              onClick={() => setActiveTab('image')}
              className={`flex items-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'image'
                  ? 'bg-purple-100 text-purple-700 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Image to Prompt
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`flex items-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'text'
                  ? 'bg-purple-100 text-purple-700 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Text to Prompt
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Column - Upload */}
          <div>
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex gap-4 mb-6">
                  <Button
                    onClick={() => setUploadMethod('upload')}
                    className={
                      uploadMethod === 'upload'
                        ? 'bg-purple-600 text-white hover:bg-purple-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }
                  >
                    Upload Image
                  </Button>
                  <Button
                    onClick={() => setUploadMethod('url')}
                    variant="outline"
                    className={
                      uploadMethod === 'url'
                        ? 'border-purple-600 text-purple-600'
                        : ''
                    }
                  >
                    Input Image URL
                  </Button>
                </div>

                {uploadMethod === 'upload' ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-purple-400 transition-colors">
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <svg
                        className="mx-auto h-16 w-16 text-purple-400"
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
                      <p className="mt-4 text-sm font-medium text-gray-900">
                        Upload a photo or drag and drop
                      </p>
                      <p className="mt-2 text-xs text-gray-500">
                        PNG, JPG, or WEBP up to 4MB
                      </p>
                    </label>
                  </div>
                ) : (
                  <input
                    type="url"
                    placeholder="Enter image URL"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200"
                  />
                )}
              </CardContent>
            </Card>

            {/* AI Model Selection */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
                Select AI Model
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {aiModels.map((model) => (
                  <Card
                    key={model.id}
                    className={`cursor-pointer transition-all ${
                      selectedModel === model.id
                        ? 'border-2 border-purple-600 bg-purple-50'
                        : 'hover:border-purple-200'
                    }`}
                    onClick={() => setSelectedModel(model.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {model.name}
                          </h4>
                          <p className="mt-1 text-xs text-gray-600">
                            {model.description}
                          </p>
                        </div>
                        {selectedModel === model.id && (
                          <svg
                            className="h-5 w-5 text-purple-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Language Selection */}
              <div className="mt-6">
                <label className="mb-2 block text-sm font-medium text-gray-900">
                  Prompt Language
                </label>
                <select className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-200">
                  <option>English</option>
                  <option>中文</option>
                  <option>日本語</option>
                  <option>한국어</option>
                </select>
              </div>

              {/* Generate Button */}
              <div className="mt-6 flex gap-4">
                <Button
                  onClick={() =>
                    setGeneratedPrompt(
                      'A beautiful landscape with mountains and a lake at sunset, vibrant colors, professional photography, high detail, 4K resolution'
                    )
                  }
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-medium"
                >
                  Generate Prompt
                </Button>
                <Button variant="outline" className="border-purple-600 text-purple-600">
                  View History
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Preview and Results */}
          <div>
            {/* Image Preview */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Image Preview
                </h3>
                <div className="flex h-64 items-center justify-center rounded-lg bg-gray-100">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-contain"
                    />
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
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="mt-4 text-sm text-gray-500">
                        Your image will show here
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Generated Prompt */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Generated prompt will appear here
                </h3>
                {generatedPrompt ? (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-gray-700">{generatedPrompt}</p>
                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          navigator.clipboard.writeText(generatedPrompt)
                        }
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Copy
                      </Button>
                      <Button size="sm" variant="outline">
                        Download
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
                    <p className="text-sm text-gray-500">
                      Upload an image and click Generate Prompt to see results
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom Info Section */}
        <div className="mt-16 rounded-lg bg-amber-50 p-6 text-center">
          <p className="text-sm text-gray-700">
            Want to analyze specific aspects like art style or describe people in
            the image? Try our{' '}
            <a href="#" className="font-medium text-purple-600 hover:text-purple-700">
              AI Describe Image
            </a>{' '}
            tool for detailed analysis.
          </p>
        </div>

        {/* Additional Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Highly Accurate Image to Prompt Generation
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Convert original images to prompts and regenerated with AI to see our
            prompt accuracy
          </p>
        </div>
      </div>
    </main>
  );
}
