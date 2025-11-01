# 🚀 Hailuo 2.3 快速启动指南

## 第一步: 配置 API Key

1. 复制环境变量文件:
```bash
cp .env.example .env.local
```

2. 编辑 `.env.local`,添加你的 MiniMax API Key:
```env
MINIMAX_API_KEY=你的密钥
```

3. 获取 API Key:
   - 访问: https://platform.minimaxi.com/
   - 登录/注册账号
   - 前往: 用户中心 → 基本信息 → 接口密钥
   - 创建或复制 API Key

## 第二步: 安装依赖

```bash
npm install
```

## 第三步: 启动开发服务器

```bash
npm run dev
```

## 第四步: 访问页面

打开浏览器访问:
- 主页: http://localhost:3000
- Hailuo 2.3: http://localhost:3000/hailuo23

## 第五步: 开始创作

### 文字转视频示例:

1. 选择 "📝 文字转视频"
2. 输入: "A cute cat playing with a ball in the garden"
3. 选择运镜: [Push in]
4. 模型: MiniMax-Hailuo-2.3
5. 时长: 6秒
6. 分辨率: 1080P
7. 点击 "✨ 生成视频"
8. 等待 1-2 分钟

### 图片转视频示例:

1. 选择 "🖼️ 图片转视频"
2. 上传一张图片
3. 描述: "The person starts smiling and waving"
4. 选择运镜: [Zoom in]
5. 点击 "✨ 生成视频"
6. 等待 1-2 分钟

## 🎯 功能亮点

- ✅ 文字/图片双模式
- ✅ 15种相机运镜
- ✅ 双模型选择
- ✅ 多分辨率支持
- ✅ 实时状态更新
- ✅ 视频下载

## 📖 详细文档

查看完整文档:
- [HAILUO23_GUIDE.md](./HAILUO23_GUIDE.md) - 完整使用指南
- [HAILUO23_COMPLETION_REPORT.md](./HAILUO23_COMPLETION_REPORT.md) - 功能实现报告

## ⚡ 快速命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 生产运行
npm start

# 类型检查
npx tsc --noEmit

# 代码检查
npm run lint
```

## 🎉 开始享受 AI 视频创作吧！
