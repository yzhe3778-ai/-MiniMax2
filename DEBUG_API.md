# 🔧 Hailuo 2.3 API 调试指南

## 问题：API响应中未包含task_id

### ✅ 已修复的问题

1. **分辨率参数错误**: 已从 `768P` 修正为 `720P`（符合 MiniMax API 规范）

### 🔍 诊断步骤

#### 1. 检查 API Key 配置

打开 `.env.local` 文件，确认包含：

```env
MINIMAX_API_KEY=你的实际API密钥
```

**验证方法**：
- API Key 应该是一串长字符串（通常 40+ 字符）
- 不应该有引号包裹
- 不应该有空格

#### 2. 查看浏览器控制台

打开浏览器开发者工具（F12），查看：

1. **Console 标签页** - 查看前端错误
2. **Network 标签页** - 查看 API 请求详情
   - 找到 `/api/hailuo23/generate` 请求
   - 查看 Request Payload（发送的数据）
   - 查看 Response（返回的数据）

#### 3. 查看服务器日志

在运行 `npm run dev` 的终端窗口中，查看详细日志：

```
调用 MiniMax 视频生成 API...
Model: MiniMax-Hailuo-2.3
Duration: 6
Resolution: 1080P
Prompt: 你的提示词
API URL: https://api.minimax.io/v1/video_generation
发送请求数据: {...}
HTTP 状态码: 200 或 500
原始响应文本: {...}
```

### 🐛 常见错误及解决方案

#### 错误 1: "MiniMax API Key 未配置"

**原因**: 环境变量未正确加载

**解决**:
1. 确认 `.env.local` 文件在项目根目录
2. 重启开发服务器（Ctrl+C 然后重新 `npm run dev`）
3. 确认文件名是 `.env.local` 而不是 `.env.local.txt`

#### 错误 2: "API 响应中未包含 task_id"

**可能原因**:
1. **API Key 无效或过期**
   - 解决：去 MiniMax 平台重新生成 API Key
   
2. **账户余额不足**
   - 解决：充值账户
   
3. **API 端点错误**
   - 当前使用：`https://api.minimax.io/v1/video_generation`
   - 如果不对，需要查看 MiniMax 最新文档
   
4. **请求参数格式错误**
   - 检查服务器日志中的 "发送请求数据"
   - 确认所有必需字段都存在

#### 错误 3: HTTP 401 Unauthorized

**原因**: API Key 认证失败

**解决**:
1. 检查 API Key 是否正确复制（没有多余空格）
2. 确认 API Key 在 MiniMax 平台是激活状态
3. 检查 API Key 权限是否包含视频生成

#### 错误 4: HTTP 400 Bad Request

**原因**: 请求参数错误

**检查**:
- `model`: 必须是 `MiniMax-Hailuo-2.3` 或 `MiniMax-Hailuo-2.3-fast`
- `duration`: 必须是 `6` 或 `10`（数字类型）
- `resolution`: 必须是 `720P` 或 `1080P`（字符串）
- `prompt`: 不能为空

**特殊限制**:
- `MiniMax-Hailuo-2.3` + `10秒` 只能用 `720P`
- `MiniMax-Hailuo-2.3-fast` 只支持图片转视频

### 📝 测试建议

#### 最简单的测试用例

1. 模式：**文字转视频**
2. 提示词：`A cat sitting on a chair`
3. 模型：`MiniMax-Hailuo-2.3`
4. 时长：`6秒`
5. 分辨率：`1080P`
6. 运镜：不选择

这是最基础的配置，应该能正常工作。

### 🔗 MiniMax API 文档

如果以上都不行，可能需要查看最新的 API 文档：

1. 访问：https://platform.minimaxi.com/docs
2. 查找：Video Generation API
3. 确认：
   - API 端点 URL
   - 请求参数格式
   - 响应数据结构
   - 是否有新的必需参数

### 💡 临时解决方案

如果 MiniMax API 暂时无法使用，可以：

1. 检查 MiniMax 平台状态页面
2. 联系 MiniMax 技术支持
3. 查看是否有 API 维护公告

### 📞 获取帮助

如果问题仍然存在，请提供以下信息：

1. 完整的服务器日志（从 "调用 MiniMax 视频生成 API..." 开始）
2. 浏览器 Network 标签中的完整响应
3. 你的 MiniMax 账户状态（余额、API Key 状态等）

---

## 🎯 快速检查清单

- [ ] `.env.local` 文件存在且包含有效的 `MINIMAX_API_KEY`
- [ ] 已重启开发服务器
- [ ] MiniMax 账户有足够余额
- [ ] API Key 在平台上是激活状态
- [ ] 使用了正确的参数组合（避免 10秒+1080P）
- [ ] 查看了服务器日志中的详细错误信息
- [ ] 查看了浏览器控制台的错误信息

