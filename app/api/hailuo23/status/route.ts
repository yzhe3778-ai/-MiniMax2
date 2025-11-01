import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const taskId = searchParams.get('task_id');

    if (!taskId) {
      return NextResponse.json(
        { error: '请提供任务 ID' },
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

    console.log('查询视频生成状态，task_id:', taskId);

    // 调用 MiniMax API 查询任务状态 - 正确的域名是 api.minimax.io
    const apiUrl = `https://api.minimax.io/v1/query/video_generation?task_id=${taskId}`;
    console.log('查询 API URL:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    console.log('MiniMax 状态查询完整响应:', JSON.stringify(data, null, 2));
    console.log('HTTP 状态码:', response.status);

    if (!response.ok) {
      console.error('查询任务状态失败:', data);
      return NextResponse.json(
        { error: data.base_resp?.status_msg || data.message || '查询任务状态失败', details: data },
        { status: response.status }
      );
    }

    console.log('任务状态:', data.status);

    // 返回标准化的响应
    return NextResponse.json({
      task_id: taskId,
      status: data.status, // Processing, Success, Failed
      video_url: data.file_id ? `https://api.minimax.io/v1/files/retrieve?file_id=${data.file_id}` : null,
      file_id: data.file_id,
      raw_data: data,
    });

  } catch (error) {
    console.error('查询状态错误:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '查询状态失败',
      },
      { status: 500 }
    );
  }
}
