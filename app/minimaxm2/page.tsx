'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function MiniMaxM2Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // 构建 API 消息格式
      const apiMessages = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content,
      }));

      console.log('发送消息到 MiniMax API...');

      const response = await fetch('/api/minimaxm2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: apiMessages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'API 调用失败');
      }

      const data = await response.json();
      console.log('MiniMax API 响应:', data);

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.message || '抱歉，我没有收到有效的响应。',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    } catch (error) {
      console.error('发送消息失败:', error);

      const errorMessage: Message = {
        role: 'assistant',
        content: `抱歉，发生了错误：${error instanceof Error ? error.message : '未知错误'}`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-10 w-10 rounded-lg overflow-hidden">
                <Image
                  src="/logo.png"
                  alt="minimaxm2 Logo"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                minimaxm2
              </span>
            </Link>
            <Link href="/">
              <Button variant="outline">返回首页</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-8">
        {/* Welcome Section */}
        {messages.length === 0 && (
          <div className="text-center py-12">
            <h1 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                上午好，
              </span>
              有什么可以帮忙的？
            </h1>
            <p className="text-gray-600 mb-8">
              请输入任务，然后送给 MiniMax Agent
            </p>

            {/* Quick Start Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 max-w-4xl mx-auto">
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-purple-100">
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800 mb-2">💡 创意生成</h3>
                  <p className="text-sm text-gray-600">帮我生成一个创意的营销方案</p>
                </div>
              </Card>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-purple-100">
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800 mb-2">📝 内容创作</h3>
                  <p className="text-sm text-gray-600">写一篇关于人工智能的文章</p>
                </div>
              </Card>
              <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-purple-100">
                <div className="text-left">
                  <h3 className="font-semibold text-gray-800 mb-2">🎨 设计建议</h3>
                  <p className="text-sm text-gray-600">为我的网站提供设计建议</p>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.length > 0 && (
          <div className="mb-32">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-6 ${
                  message.role === 'user' ? 'flex justify-end' : 'flex justify-start'
                }`}
              >
                <div
                  className={`max-w-3xl ${
                    message.role === 'user'
                      ? 'bg-purple-600 text-white rounded-2xl rounded-tr-sm'
                      : 'bg-white border border-gray-200 rounded-2xl rounded-tl-sm'
                  } px-6 py-4`}
                >
                  <p className={message.role === 'user' ? 'text-white' : 'text-gray-800'}>
                    {message.content}
                  </p>
                  <p
                    className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-purple-100' : 'text-gray-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString('zh-CN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-6">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-6 py-4">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input Area - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent pt-6 pb-6">
        <div className="mx-auto max-w-4xl px-4">
          <div className="bg-white border-2 border-purple-200 rounded-2xl shadow-lg p-2">
            <div className="flex items-end gap-3">
              {/* Attachment Button */}
              <button className="p-3 text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </button>

              {/* Input Field */}
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="请输入任务，然后送给 MiniMax Agent"
                className="flex-1 resize-none border-0 focus:outline-none focus:ring-0 text-gray-800 placeholder-gray-400 py-3 max-h-32"
                rows={1}
                style={{ minHeight: '24px' }}
              />

              {/* Mode Selector */}
              <div className="flex items-center gap-2 px-3 py-2 border-l border-gray-200">
                <span className="text-sm text-gray-600">高效</span>
                <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                  专业
                </button>
              </div>

              {/* Send Button */}
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                发送
              </Button>
            </div>
          </div>

          {/* Info Banner */}
          <div className="mt-3 text-center">
            <p className="text-sm text-blue-600">
              Enjoy Agent Pro for free during the M2 model launch!
              <button className="ml-2 text-blue-600 hover:text-blue-700">✕</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
