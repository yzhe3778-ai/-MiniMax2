import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, image } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: '请提供提示词' },
        { status: 400 }
      );
    }

    const webhookUrl = process.env.N8N_IMAGE_WEBHOOK_URL;

    if (!webhookUrl) {
      return NextResponse.json(
        { error: 'Webhook URL 未配置' },
        { status: 500 }
      );
    }

    console.log('开始生成图像...');
    console.log('Webhook URL:', webhookUrl);
    console.log('Prompt:', prompt);

    // 准备发送到 n8n 的数据
    const payload: { prompt: string; image?: string } = { prompt };

    if (image) {
      console.log('包含参考图片（Base64）');
      payload.image = image;
    }

    // 调用 n8n webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('n8n webhook 错误:', errorText);
      throw new Error(`Webhook 调用失败: ${response.statusText}`);
    }

    const result = await response.json();
    console.log('n8n webhook 响应:', result);

    // 从 n8n 响应中提取图片 URL
    // 根据你的 n8n 工作流返回格式调整
    let imageUrl: string | null = null;
    if (result.image_url) {
      imageUrl = result.image_url;
    } else if (result.url) {
      imageUrl = result.url;
    } else if (result.data?.image_url) {
      imageUrl = result.data.image_url;
    } else if (result.data?.url) {
      imageUrl = result.data.url;
    } else if (result.images && result.images[0]) {
      imageUrl = result.images[0];
    }

    return NextResponse.json({
      success: true,
      imageUrl,
      images: result.images,
      data: result,
    });
  } catch (error) {
    console.error('图像生成错误:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '图像生成失败',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
