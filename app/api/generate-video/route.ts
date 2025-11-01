import { NextRequest, NextResponse } from 'next/server';
import { runCozeWorkflow, pollWorkflowStatus } from '@/lib/coze';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: '请提供提示词' },
        { status: 400 }
      );
    }

    const token = process.env.COZE_API_TOKEN;
    const workflowId = process.env.COZE_WORKFLOW_ID;

    if (!token || !workflowId) {
      return NextResponse.json(
        { error: 'API 配置错误' },
        { status: 500 }
      );
    }

    console.log('开始生成视频...');
    console.log('Workflow ID:', workflowId);
    console.log('Prompt:', prompt);

    // 尝试多种参数结构，以兼容不同工作流的输入定义
    const candidateParameters = [
      { prompt },
      { input: { prompt } },
      { input: { text: prompt } },
      { inputs: { prompt } },
      { input: { prompt, text: prompt, body: prompt } },
    ];

  const attempts: Array<{ params: unknown; result: unknown }> = [];
  let successfulRun: { executeId: string; runResult: unknown } | null = null;

    for (const params of candidateParameters) {
      console.log('尝试参数格式:', JSON.stringify(params));
      const runResult = await runCozeWorkflow(workflowId, params, token);
      console.log('工作流启动尝试结果:', runResult);
      attempts.push({ params, result: runResult });

      if (runResult && runResult.code === 0 && runResult.data) {
        successfulRun = { executeId: runResult.data, runResult };
        break;
      }
    }

    if (!successfulRun) {
      // 将所有尝试的结果返回，便于调试（包含 Coze 的 debug_url / detail）
      return NextResponse.json(
        {
          error: '工作流启动失败，尝试了多种参数格式但均未通过',
          attempts,
        },
        { status: 500 }
      );
    }

    // 若启动成功，轮询执行状态
    const result = await pollWorkflowStatus(successfulRun.executeId, token as string);
    console.log('工作流执行完成:', result);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('视频生成错误:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '视频生成失败',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
