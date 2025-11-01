import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: '请提供有效的消息列表' },
        { status: 400 }
      );
    }

    const apiKey = process.env.MINIMAX_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'MiniMax API Key 未配置' },
        { status: 500 }
      );
    }

    console.log('调用 MiniMax API...');
    console.log('消息数量:', messages.length);

    // 初始化 Anthropic 客户端，使用 MiniMax 端点
    const client = new Anthropic({
      baseURL: 'https://api.minimax.io/anthropic',
      apiKey: apiKey,
    });

    // 调用 MiniMax API (兼容 Anthropic SDK)
    const response = await client.messages.create({
      model: 'MiniMax-M2',
      max_tokens: 2048,
      messages: messages,
    });

    console.log('MiniMax API 响应成功');

    // 提取文本内容
    const textContent = response.content.find((item: { type: string; text?: string }) => item.type === 'text');
    const assistantMessage = textContent && 'text' in textContent ? textContent.text : '';

    return NextResponse.json({
      success: true,
      message: assistantMessage,
      usage: response.usage,
    });
  } catch (error: unknown) {
    console.error('MiniMax API 错误:', error);

    const errorMessage = error instanceof Error ? error.message : 'MiniMax API 调用失败';
    const errorDetails = error && typeof error === 'object' && 'response' in error
      ? (error as { response?: { data?: unknown } }).response?.data
      : String(error);

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
      },
      { status: 500 }
    );
  }
}
