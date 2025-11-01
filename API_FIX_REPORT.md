# 🔧 Hailuo 2.3 API 问题修复报告

## 问题描述

视频生成一直超时，查看日志发现:
- `task_id` 一直返回 `undefined`
- 任务状态查询也一直返回 `undefined`
- 所有视频生成请求都失败

## 根本原因

**API 域名错误！**

### 错误的代码
```javascript
// ❌ 错误的域名
'https://api.minimax.chat/v1/video_generation'
'https://api.minimax.chat/v1/query/video_generation'
```

### 正确的代码
```javascript
// ✅ 正确的域名
'https://api.minimax.io/v1/video_generation'
'https://api.minimax.io/v1/query/video_generation'
```

## 已修复的文件

1. **[app/api/hailuo23/generate/route.ts](file:///e:/GitHub%20Desktop/ruoyuqsl/app/api/hailuo23/generate/route.ts)**
   - 修复 API endpoint 从 `api.minimax.chat` 到 `api.minimax.io`
   - 添加详细日志输出完整 API 响应
   - 添加 task_id 提取逻辑的错误处理

2. **[app/api/hailuo23/status/route.ts](file:///e:/GitHub%20Desktop/ruoyuqsl/app/api/hailuo23/status/route.ts)**
   - 修复查询 API endpoint
   - 添加完整响应日志
   - 返回 raw_data 便于调试

## 修复内容

### 1. 生成 API (generate/route.ts)

**修改前:**
```typescript
const response = await fetch('https://api.minimax.chat/v1/video_generation', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(requestData),
});
```

**修改后:**
```typescript
const apiUrl = 'https://api.minimax.io/v1/video_generation';
console.log('API URL:', apiUrl);
console.log('Prompt:', prompt);

const response = await fetch(apiUrl, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(requestData),
});

const data = await response.json();
console.log('MiniMax API 完整响应:', JSON.stringify(data, null, 2));
console.log('HTTP 状态码:', response.status);

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
```

### 2. 状态查询 API (status/route.ts)

**修改前:**
```typescript
const response = await fetch(
  `https://api.minimax.chat/v1/query/video_generation?task_id=${taskId}`,
  {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  }
);
```

**修改后:**
```typescript
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
```

## 测试步骤

### 1. 重启开发服务器
已自动检测到代码变更，Next.js Turbopack 会自动热重载

### 2. 测试文字转视频
1. 访问 http://localhost:3003/hailuo23
2. 选择 "📝 文字转视频"
3. 输入提示词: "A mouse runs toward the camera, smiling and blinking."
4. 点击 "✨ 生成视频"
5. 查看浏览器控制台和服务器日志

### 3. 检查日志输出

**期待看到的日志:**
```
调用 MiniMax 视频生成 API...
Model: MiniMax-Hailuo-2.3
Duration: 6
Resolution: 1080P
Prompt: A mouse runs toward the camera, smiling and blinking.
API URL: https://api.minimax.io/v1/video_generation
MiniMax API 完整响应: {
  "task_id": "实际的任务ID",
  "base_resp": {
    "status_code": 0,
    "status_msg": "success"
  }
}
提取的 task_id: 实际的任务ID
```

**然后轮询查询:**
```
查询视频生成状态，task_id: 实际的任务ID
查询 API URL: https://api.minimax.io/v1/query/video_generation?task_id=...
MiniMax 状态查询完整响应: {
  "status": "Processing",
  ...
}
```

## 预期结果

修复后应该能:
1. ✅ 成功调用 MiniMax API
2. ✅ 获得有效的 task_id
3. ✅ 正常轮询任务状态
4. ✅ 最终获得视频 URL
5. ✅ 视频可以播放和下载

## 下一步

现在请:
1. **刷新浏览器页面** http://localhost:3003/hailuo23
2. **尝试生成一个视频**
3. **查看服务器终端日志**，应该能看到正确的 API 响应
4. **等待 1-2 分钟**，视频应该会成功生成

## 可能仍需注意的问题

### 1. 图片上传
当前使用 base64 编码图片，MiniMax API 可能需要:
- 公网可访问的图片 URL
- 需要先上传到云存储（如 AWS S3, Cloudinary）

### 2. API 响应格式
如果仍有问题，检查完整的 API 响应日志，响应结构可能是:
```json
{
  "data": {
    "task_id": "..."
  }
}
```
而不是直接的 `task_id`，代码已经处理了这两种情况。

### 3. 视频 URL 格式
状态查询返回的 `file_id` 需要转换为下载 URL，当前代码使用:
```typescript
video_url: data.file_id
  ? `https://api.minimax.io/v1/files/retrieve?file_id=${data.file_id}`
  : null
```

可能需要根据实际 API 响应调整。

## 修复时间

**2025-11-01 14:06 (北京时间)**

## 修复者

Claude Code (Haiku-4.5 模式)

---

**现在请测试并告诉我结果！** 🎉
