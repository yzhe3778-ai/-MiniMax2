# 🎬 Hailuo 2.3 功能测试指南

## ✅ 环境配置完成

- API Key: ✅ 已配置
- 开发服务器: ✅ 运行中 (http://localhost:3003)
- 所有文件: ✅ 已创建

## 🚀 访问页面

### 主页
http://localhost:3003

### Hailuo 2.3 页面
http://localhost:3003/hailuo23

## 📝 测试步骤

### 测试 1: 文字转视频

1. **打开页面**
   - 访问: http://localhost:3003/hailuo23
   - 确认页面正常加载

2. **选择文字转视频模式**
   - 点击 "📝 文字转视频" (默认已选中)

3. **输入提示词**
   ```
   A mouse runs toward the camera, smiling and blinking.
   ```

4. **选择相机运镜** (可选)
   - 点击选择一个运镜指令，例如: [Push in]

5. **配置参数**
   - 模型: MiniMax-Hailuo-2.3
   - 时长: 6秒
   - 分辨率: 1080P

6. **生成视频**
   - 点击 "✨ 生成视频" 按钮
   - 观察生成状态
   - 等待 1-2 分钟

7. **查看结果**
   - 视频生成后会自动播放
   - 可以下载视频

### 测试 2: 图片转视频

1. **选择图片转视频模式**
   - 点击 "🖼️ 图片转视频"

2. **上传图片**
   - 点击上传区域
   - 选择一张图片 (JPG/PNG)
   - 确认图片预览显示

3. **添加描述** (可选)
   ```
   The person starts smiling and waving at the camera
   ```

4. **选择相机运镜** (可选)
   - 例如: [Zoom in]

5. **配置参数**
   - 模型: MiniMax-Hailuo-2.3-fast (测试快速模式)
   - 时长: 6秒
   - 分辨率: 720P

6. **生成视频**
   - 点击 "✨ 生成视频"
   - 等待生成完成

### 测试 3: 相机运镜指令

测试所有 15 种运镜指令:

#### Truck (平移)
- [Truck left] - 向左平移
- [Truck right] - 向右平移

#### Pan (摇镜)
- [Pan left] - 向左摇
- [Pan right] - 向右摇

#### Push (推拉)
- [Push in] - 推进
- [Pull out] - 拉远

#### Pedestal (升降)
- [Pedestal up] - 上升
- [Pedestal down] - 下降

#### Tilt (倾斜)
- [Tilt up] - 向上倾斜
- [Tilt down] - 向下倾斜

#### Zoom (缩放)
- [Zoom in] - 放大
- [Zoom out] - 缩小

#### Special (特殊)
- [Shake] - 晃动
- [Tracking shot] - 跟拍
- [Static shot] - 静态

## 🎯 功能检查清单

### UI 功能
- [ ] 页面正常加载
- [ ] 模式切换流畅
- [ ] 文字输入正常
- [ ] 图片上传正常
- [ ] 图片预览显示
- [ ] 运镜指令可选择
- [ ] 参数设置可调整
- [ ] 按钮状态正确

### API 功能
- [ ] 视频生成请求成功
- [ ] 返回 task_id
- [ ] 状态轮询正常
- [ ] 获取视频 URL
- [ ] 视频可播放
- [ ] 视频可下载

### 错误处理
- [ ] 未输入内容时显示错误
- [ ] API 错误时显示提示
- [ ] 超时时显示提示
- [ ] 生成失败时可重试

## 🐛 可能遇到的问题

### 问题 1: API Key 无效
**症状**: 返回 401 或认证错误

**解决**:
1. 检查 `.env.local` 中的 `MINIMAX_API_KEY`
2. 确认 Key 没有被截断
3. 重启开发服务器

### 问题 2: CORS 错误
**症状**: 浏览器控制台显示 CORS 错误

**解决**:
- MiniMax API 应该支持跨域
- 检查 API endpoint 是否正确

### 问题 3: 图片上传失败
**症状**: 图片无法显示或上传失败

**解决**:
- 检查图片格式 (JPG/PNG)
- 检查图片大小 (建议 < 5MB)
- 使用 base64 编码

### 问题 4: 视频生成超时
**症状**: 超过 3 分钟仍未完成

**解决**:
- MiniMax 服务可能繁忙
- 降低分辨率重试
- 使用 fast 模式

## 📊 预期结果

### 成功的视频生成流程

1. **提交阶段**
   - 按钮显示 "生成中，请稍候..."
   - 显示 loading 动画

2. **轮询阶段**
   - 显示 task_id
   - 每秒查询一次状态
   - 状态: Processing

3. **完成阶段**
   - 状态变为 Success
   - 获取视频 URL
   - 视频自动播放
   - 显示下载按钮

### API 响应示例

**生成请求响应**:
```json
{
  "task_id": "106916112212032",
  "status": "processing"
}
```

**状态查询响应** (处理中):
```json
{
  "task_id": "106916112212032",
  "status": "Processing",
  "video_url": null,
  "file_id": null
}
```

**状态查询响应** (成功):
```json
{
  "task_id": "106916112212032",
  "status": "Success",
  "video_url": "https://...",
  "file_id": "..."
}
```

## 🎨 示例提示词

### 自然场景
```
A serene beach at sunset, waves gently crashing on the shore, golden light reflecting on the water
```

### 动物
```
A playful golden retriever puppy running through a meadow of flowers, tail wagging happily
```

### 科幻
```
A futuristic cityscape with flying cars, neon lights, and towering skyscrapers reaching into the clouds
```

### 配合运镜
```
[Push in] A single red rose in a vase, morning sunlight streaming through the window
[Tracking shot] An athlete running on a track, determined expression, motion blur background
[Zoom in] A chef preparing a gourmet dish, steam rising, intricate details
```

## 🔍 调试技巧

### 1. 浏览器开发者工具
- 打开控制台 (F12)
- 查看 Network 标签
- 检查 API 请求和响应

### 2. 服务器日志
- 查看终端输出
- 检查 API 调用日志
- 确认请求参数

### 3. 检查点
- API Key 是否正确
- 网络连接是否正常
- MiniMax 服务是否可用
- 请求参数是否符合规范

## 📞 需要帮助？

如遇到问题,请查看:
1. 浏览器控制台错误信息
2. 服务器终端日志
3. [HAILUO23_GUIDE.md](./HAILUO23_GUIDE.md)
4. [MiniMax 官方文档](https://platform.minimaxi.com/docs)

## ✨ 开始测试

现在打开浏览器访问:
**http://localhost:3003/hailuo23**

祝测试顺利！🎉
