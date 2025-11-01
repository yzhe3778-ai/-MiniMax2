import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const prompt = formData.get('prompt') as string;
    const model = formData.get('model') as string;
    const duration = parseInt(formData.get('duration') as string);
    const resolution = formData.get('resolution') as string;
    const image = formData.get('image') as File | null;

    if (!prompt && !image) {
      return NextResponse.json(
        { error: '请提供提示词或图片' },
        { status: 400 }
      );
    }

    const token = process.env.MINIMAX_API_KEY;

    if (!token) {
      return NextResponse.json(
        { error: 'MiniMax API Key 未配置' },
        { status: 500 }
      );
    }

    // 构建请求数据
    const requestData: {
      prompt: string;
      model: string;
      duration: number;
      resolution: string;
      first_frame_image?: string;
    } = {
      prompt,
      model,
      duration,
      resolution,
    };

    // 如果是图片转视频模式，需要上传图片获取 URL
    if (image) {
      // 这里需要先将图片上传到云存储获取 URL
      // 暂时使用 base64 编码 (实际生产环境应该使用 CDN)
      const imageBuffer = await image.arrayBuffer();
      const base64Image = Buffer.from(imageBuffer).toString('base64');
      const imageDataUrl = `data:${image.type};base64,${base64Image}`;

      // 注意: MiniMax API 可能需要公网可访问的图片 URL
      // 这里可能需要先上传到云存储服务
      requestData.first_frame_image = imageDataUrl;
    }

    console.log('调用 MiniMax 视频生成 API...');
    console.log('Model:', model);
    console.log('Duration:', duration);
    console.log('Resolution:', resolution);
    console.log('Prompt:', prompt);

    // 调用 MiniMax API - 正确的域名是 api.minimax.io
    const apiUrl = 'https://api.minimax.io/v1/video_generation';
    console.log('API URL:', apiUrl);

    console.log('发送请求数据:', JSON.stringify(requestData, null, 2));
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    console.log('HTTP 状态码:', response.status);
    console.log('响应头:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('原始响应文本:', responseText);
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('解析后的 JSON:', JSON.stringify(data, null, 2));
    } catch (parseError) {
      console.error('JSON 解析失败:', parseError);
      return NextResponse.json(
        { error: 'API 响应格式错误', details: responseText },
        { status: 500 }
      );
    }

    if (!response.ok) {
      console.error('MiniMax API 错误:', data);

      // 处理特定错误
      let errorMessage = data.base_resp?.status_msg || data.message || '视频生成请求失败';

      // 余额不足
      if (data.base_resp?.status_code === 1008) {
        errorMessage = 'MiniMax 账户余额不足，请充值后重试';
      }
      // 参数错误
      else if (data.base_resp?.status_code === 2013) {
        errorMessage = `参数配置错误: ${data.base_resp.status_msg}`;
      }

      return NextResponse.json(
        { error: errorMessage, details: data },
        { status: response.status }
      );
    }

    // 检查响应中的 task_id
    const taskId = data.task_id || data.data?.task_id;
    console.log('提取的 task_id:', taskId);

    if (!taskId) {
      console.error('未找到 task_id，完整响应:', data);
      return NextResponse.json(
        { error: 'API 响应中未包含 task_id', details: data },
        { status: 500 }
      );
    }

    return NextResponse.json({
      task_id: taskId,
      status: 'processing',
    });

  } catch (error) {
    console.error('视频生成错误:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '视频生成失败',
      },
      { status: 500 }
    );
  }
}
