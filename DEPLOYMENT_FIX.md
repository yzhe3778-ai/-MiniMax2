# 🔧 Cloudflare Pages 部署错误修复

## ❌ 错误信息

```
⚡️ Please make sure that all your non-static routes export the following edge runtime route segment config:
⚡️   export const runtime = 'edge';
⚡️ 
⚡️ You can read more about the Edge Runtime on the Next.js documentation:
⚡️   https://nextjs.org/docs/app/building-your-application/rendering/edge-and-nodejs-runtimes
```

## ✅ 已修复

### 修复内容

在所有 API 路由文件的顶部添加了 Edge Runtime 配置：

```typescript
export const runtime = 'edge';
```

### 已更新的文件

✅ **app/api/feedback/route.ts**
```typescript
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';  // ← 新增

export async function POST(request: NextRequest) {
  // ...
}
```

✅ **app/api/hailuo23/generate/route.ts**
```typescript
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';  // ← 新增

export async function POST(request: NextRequest) {
  // ...
}
```

✅ **app/api/hailuo23/status/route.ts**
```typescript
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';  // ← 新增

export async function GET(request: NextRequest) {
  // ...
}
```

✅ **app/api/minimaxm2/route.ts**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export const runtime = 'edge';  // ← 新增

export async function POST(request: NextRequest) {
  // ...
}
```

✅ **app/api/generate-image/route.ts**
```typescript
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';  // ← 新增

export async function POST(request: NextRequest) {
  // ...
}
```

✅ **app/api/generate-video/route.ts**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { runCozeWorkflow, pollWorkflowStatus } from '@/lib/coze';

export const runtime = 'edge';  // ← 新增

export async function POST(request: NextRequest) {
  // ...
}
```

## 🚀 现在可以部署了

### 提交更改

```bash
git add .
git commit -m "fix: 添加 Edge Runtime 配置以支持 Cloudflare Pages 部署"
git push origin master
```

### Cloudflare 会自动重新部署

推送后，Cloudflare Pages 会自动：
1. 检测到新的提交
2. 开始构建
3. 运行 `npx @cloudflare/next-on-pages`
4. 部署到生产环境

## 📊 预期结果

### 构建成功日志

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
✓ Collecting build traces
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                   1.2 kB         100 kB
├ ○ /hailuo23                          2.5 kB         102 kB
├ ○ /minimaxm2                         1.8 kB         101 kB
└ ○ /sora2                             2.1 kB         102 kB

○  (Static)  prerendered as static content
```

### 部署成功

```
✓ Build completed successfully
✓ Deploying to production
✓ Deployment complete

Your site is live at:
https://minimax2.pages.dev
```

## 🔍 什么是 Edge Runtime？

### Edge Runtime vs Node.js Runtime

| 特性 | Edge Runtime | Node.js Runtime |
|------|--------------|-----------------|
| **运行位置** | Cloudflare 边缘节点 | 服务器 |
| **启动速度** | 极快（< 1ms） | 较慢 |
| **全球分布** | 是 | 否 |
| **API 支持** | 部分 Node.js API | 完整 Node.js API |
| **适用场景** | API 路由、中间件 | 复杂服务端逻辑 |

### 为什么 Cloudflare 需要 Edge Runtime？

1. **全球加速**：在离用户最近的边缘节点运行
2. **快速响应**：冷启动时间 < 1ms
3. **高可用性**：分布在全球 200+ 个数据中心
4. **自动扩展**：无需配置服务器

### Edge Runtime 限制

某些 Node.js 功能在 Edge Runtime 中不可用：
- ❌ 文件系统操作（`fs`）
- ❌ 原生模块
- ❌ 某些 Node.js 内置模块

但对于 API 路由来说，Edge Runtime 完全够用：
- ✅ `fetch` API
- ✅ 环境变量
- ✅ JSON 处理
- ✅ 数据库连接（通过 HTTP）

## 📝 最佳实践

### 1. 所有 API 路由都使用 Edge Runtime

```typescript
// ✅ 正确
export const runtime = 'edge';

export async function POST(request: NextRequest) {
  // ...
}
```

```typescript
// ❌ 错误（在 Cloudflare Pages 上会失败）
// 没有 export const runtime = 'edge';

export async function POST(request: NextRequest) {
  // ...
}
```

### 2. 避免使用 Node.js 特定功能

```typescript
// ❌ 不要使用 fs
import fs from 'fs';

// ✅ 使用 fetch
const response = await fetch('https://api.example.com');
```

### 3. 使用环境变量

```typescript
// ✅ 正确
const apiKey = process.env.MINIMAX_API_KEY;
```

## 🎯 验证部署

### 1. 检查构建日志

在 Cloudflare Pages 控制台查看：
- 构建是否成功
- 是否有错误信息
- 部署时间

### 2. 测试 API 路由

部署成功后，测试所有 API：

```bash
# 测试反馈 API
curl -X POST https://你的域名.com/api/feedback \
  -H "Content-Type: application/json" \
  -d '{"name":"测试","email":"test@example.com","message":"测试消息"}'

# 测试 Hailuo 2.3
curl -X POST https://你的域名.com/api/hailuo23/generate \
  -F "prompt=测试视频" \
  -F "model=MiniMax-Hailuo-2.3" \
  -F "duration=6" \
  -F "resolution=1080P"
```

### 3. 检查环境变量

确认所有环境变量都已在 Cloudflare Pages 中设置：
- ✅ `NODE_VERSION=18`
- ✅ `MINIMAX_API_KEY=你的密钥`
- ✅ `COZE_API_TOKEN=你的Token`（如果使用 Sora2）
- ✅ `COZE_WORKFLOW_ID=你的工作流ID`（如果使用 Sora2）

## 🎉 总结

### 问题原因
Cloudflare Pages 要求所有动态路由（API 路由）必须使用 Edge Runtime。

### 解决方案
在所有 API 路由文件中添加：
```typescript
export const runtime = 'edge';
```

### 已修复的文件
✅ 6 个 API 路由文件全部更新

### 下一步
1. 提交并推送代码
2. 等待 Cloudflare 自动部署
3. 验证部署成功
4. 测试所有功能

---

**部署应该现在可以成功了！** 🚀

如果还有其他错误，请查看构建日志并告诉我具体的错误信息。

