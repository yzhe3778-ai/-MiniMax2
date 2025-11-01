# Hailuo 2.3 视频生成功能

## 功能概述

Hailuo 2.3 是基于 MiniMax 视频生成 API 的高质量视频生成功能，支持文字转视频和图片转视频两种模式。

## 主要特性

### ✨ 核心功能

1. **文字转视频 (Text-to-Video)**
   - 输入文字描述即可生成视频
   - 支持详细的场景和动作描述
   - AI 智能理解并生成符合描述的视频内容

2. **图片转视频 (Image-to-Video)**
   - 上传参考图片
   - 可选添加动作描述
   - 保持图片主体特征的同时生成动态视频

3. **15 种相机运镜指令**
   - **Truck**: [Truck left], [Truck right] - 左右平移
   - **Pan**: [Pan left], [Pan right] - 左右摇镜
   - **Push**: [Push in], [Pull out] - 推进/拉远
   - **Pedestal**: [Pedestal up], [Pedestal down] - 升降镜头
   - **Tilt**: [Tilt up], [Tilt down] - 上下倾斜
   - **Zoom**: [Zoom in], [Zoom out] - 放大/缩小
   - **Shake**: [Shake] - 晃动镜头
   - **Follow**: [Tracking shot] - 跟拍
   - **Static**: [Static shot] - 静态镜头

4. **模型选择**
   - **MiniMax-Hailuo-2.3**: 高质量模型，生成效果最佳
   - **MiniMax-Hailuo-2.3-fast**: 快速模型，生成速度更快

5. **自定义参数**
   - **时长**: 6 秒 / 10 秒
   - **分辨率**: 720P / 1080P

## 使用指南

### 1. 配置环境变量

在 `.env.local` 文件中添加 MiniMax API Key:

```env
MINIMAX_API_KEY=your-minimax-api-key
```

获取 API Key:
1. 访问 [MiniMax 平台](https://platform.minimaxi.com/)
2. 登录/注册账号
3. 前往 [用户中心 - 基本信息 - 接口密钥](https://platform.minimaxi.com/user-center/basic-information/interface-key)
4. 创建或复制 API Key

### 2. 访问功能页面

启动开发服务器后访问: `http://localhost:3000/hailuo23`

### 3. 文字转视频

1. 选择 "📝 文字转视频" 模式
2. 输入视频描述 (例如: "A mouse runs toward the camera, smiling and blinking.")
3. 可选: 选择一个相机运镜指令
4. 设置模型、时长、分辨率
5. 点击 "✨ 生成视频"
6. 等待 1-2 分钟后视频生成完成

### 4. 图片转视频

1. 选择 "🖼️ 图片转视频" 模式
2. 点击上传参考图片 (支持 JPG, PNG 等格式)
3. 可选: 添加动作描述
4. 可选: 选择相机运镜指令
5. 设置模型、时长、分辨率
6. 点击 "✨ 生成视频"
7. 等待 1-2 分钟后视频生成完成

### 5. 下载视频

视频生成完成后:
- 点击 "下载视频" 按钮保存到本地
- 或点击 "重新生成" 开始新的创作

## API 参考

### 生成视频 API

**Endpoint**: `/api/hailuo23/generate`

**Method**: POST

**Request Body** (multipart/form-data):

```typescript
{
  prompt: string;           // 视频描述 (必填)
  model: string;           // 模型名称 (必填)
  duration: number;        // 视频时长 6 或 10 (必填)
  resolution: string;      // 分辨率 "720P" 或 "1080P" (必填)
  image?: File;           // 参考图片 (图片转视频模式)
}
```

**Response**:

```json
{
  "task_id": "106916112212032",
  "status": "processing"
}
```

### 查询状态 API

**Endpoint**: `/api/hailuo23/status`

**Method**: GET

**Query Parameters**:

```
?task_id=106916112212032
```

**Response**:

```json
{
  "task_id": "106916112212032",
  "status": "Success",
  "video_url": "https://...",
  "file_id": "..."
}
```

**状态值**:
- `Processing`: 生成中
- `Success`: 生成成功
- `Failed`: 生成失败

## 最佳实践

### 提示词编写技巧

1. **描述要详细具体**
   - ❌ "一只猫"
   - ✅ "一只橘色的小猫在阳光明媚的花园里追逐蝴蝶，画面温馨自然"

2. **包含动作和场景**
   - ❌ "风景"
   - ✅ "海边日落，海浪轻轻拍打沙滩，天空呈现橙红色渐变"

3. **使用相机运镜增强效果**
   - "[Push in] 一朵花慢慢盛开" - 推进镜头增强视觉冲击
   - "[Tracking shot] 运动员在跑道上奔跑" - 跟拍增强动感
   - "[Zoom in] 人物的表情特写" - 放大强调细节

4. **合理选择时长**
   - 简单场景: 6 秒
   - 复杂动作或多个场景: 10 秒

5. **分辨率选择**
   - 快速预览: 720P
   - 最终成品: 1080P

### 图片转视频技巧

1. **图片质量**: 使用清晰、光线充足的图片
2. **主体明确**: 确保图片主体清晰可见
3. **动作描述**: 添加具体的动作描述会有更好的效果
4. **相机运镜**: 静态图片配合运镜指令效果更佳

## 定价信息

根据 MiniMax 官方定价:
- 输入: ¥0.2/M tokens
- 输出: ¥0.2/M tokens

视频生成按视频时长和分辨率计费,具体费用请参考 [MiniMax 官方文档](https://platform.minimaxi.com/docs)。

## 技术架构

```
用户界面 (React)
    ↓
Next.js API Routes
    ↓
MiniMax Video Generation API
    ↓
任务队列 & 轮询
    ↓
视频生成完成
    ↓
返回视频 URL
```

## 故障排查

### 问题 1: API Key 未配置

**错误**: "MiniMax API Key 未配置"

**解决**: 确保 `.env.local` 中正确配置了 `MINIMAX_API_KEY`

### 问题 2: 视频生成失败

**可能原因**:
- 提示词包含敏感内容
- API 配额不足
- 网络连接问题

**解决**: 检查控制台日志,查看具体错误信息

### 问题 3: 生成超时

**错误**: "生成超时，请重试"

**解决**:
- 视频生成通常需要 1-2 分钟
- 如果超过 3 分钟仍未完成,可能是服务繁忙
- 稍后重试或降低分辨率

## 相关资源

- [MiniMax 官方文档](https://platform.minimaxi.com/docs)
- [视频生成 API 文档](https://platform.minimaxi.com/docs/api-reference/video-generation-i2v)
- [相机运镜指令说明](https://platform.minimaxi.com/docs/guides/camera-commands)

## 版本历史

### v1.0.0 (2025-01-01)
- ✨ 初始版本发布
- ✅ 支持文字转视频
- ✅ 支持图片转视频
- ✅ 15 种相机运镜指令
- ✅ 双模型选择 (标准/快速)
- ✅ 自定义时长和分辨率
- ✅ 实时任务状态轮询
- ✅ 视频下载功能
