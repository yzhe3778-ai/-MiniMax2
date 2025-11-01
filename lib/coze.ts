// Coze API 工具函数

const COZE_API_BASE = 'https://api.coze.cn';

export interface CozeFileUploadResponse {
  code: number;
  msg: string;
  data?: {
    id: string;
    bytes: number;
    created_at: number;
    filename: string;
  };
}

export interface CozeWorkflowRunResponse {
  code: number;
  msg: string;
  data?: string;
  debug_url?: string;
}

/**
 * 上传文件到 Coze
 */
export async function uploadFileToCoze(
  file: File,
  token: string
): Promise<CozeFileUploadResponse> {
  const formData = new FormData();
  formData.append('file', file);

  console.log('上传文件到 Coze...');

  const response = await fetch(`${COZE_API_BASE}/v1/files/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const result = await response.json();
  console.log('文件上传响应:', result);

  if (!response.ok) {
    throw new Error(`上传失败: ${result.msg || response.statusText}`);
  }

  return result;
}

/**
 * 运行 Coze 工作流
 */
export async function runCozeWorkflow(
  workflowId: string,
  parameters: Record<string, unknown>,
  token: string
): Promise<CozeWorkflowRunResponse> {
  const requestBody = {
    workflow_id: workflowId,
    parameters,
  };

  console.log('调用工作流 API...');
  console.log('请求体:', JSON.stringify(requestBody, null, 2));

  const response = await fetch(`${COZE_API_BASE}/v1/workflow/run`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  const result = await response.json();
  console.log('工作流 API 响应:', result);
  console.log('响应状态:', response.status);
  // 不在此抛出异常，让调用方处理 API 返回的业务错误（例如缺少字段）
  return result;
}

/**
 * 轮询工作流执行状态
 */
export async function pollWorkflowStatus(
  executeId: string,
  token: string,
  maxAttempts = 60,
  interval = 2000
): Promise<unknown> {
  console.log('开始轮询工作流状态...', executeId);

  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((resolve) => setTimeout(resolve, interval));

    const response = await fetch(
      `${COZE_API_BASE}/v1/workflow/run/${executeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`查询状态失败: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`轮询次数 ${i + 1}:`, result.data?.status);

    if (result.data?.status === 'completed') {
      console.log('工作流执行完成!');
      return result.data;
    }

    if (result.data?.status === 'failed') {
      throw new Error('工作流执行失败');
    }
  }

  throw new Error('工作流执行超时');
}
