# MiniMax API 功能说明

## 当前已实现的功能

### 1. 文本生成（Text Generation）
- **模型**: MiniMax-M2
- **端点**: https://api.minimax.io/anthropic
- **功能**: 对话式 AI 交互
- **实现位置**: `/app/api/minimaxm2/route.ts`

#### 使用示例
```javascript
const response = await client.messages.create({
  model: 'MiniMax-M2',
  max_tokens: 2048,
  messages: [
    {
      role: 'user',
      content: '你的问题或指令',
    },
  ],
});
```

#### 支持的功能
- ✅ 多轮对话（支持对话历史）
- ✅ 上下文理解
- ✅ 中英文支持
- ✅ 创意写作
- ✅ 问答系统
- ✅ 代码生成
- ✅ 文本分析

### 2. 当前网站功能

#### 已实现页面
1. **主页** (`/`)
   - 品牌展示
   - 功能导航
   - 快速访问按钮

2. **MiniMax Agent** (`/minimaxm2`)
   - AI 对话功能
   - 实时响应
   - 对话历史记录
   - 消息时间戳
   - 加载动画

3. **图像生成** (`/generate-image`)
   - 文生图功能
   - n8n webhook 集成
   - 图片上传支持

4. **Image to Prompt** (`/image-to-prompt`)
   - 图像分析
   - 提示词生成

5. **Sora2 视频生成** (`/sora2`)
   - 文生视频
   - Coze 工作流集成

## API 配置

### 环境变量
```env
MINIMAX_API_KEY=your_api_key_here
```

### API 调用流程
```
用户输入 → 前端页面 → Next.js API 路由 → MiniMax API → 返回响应 → 显示给用户
```

## 可能支持的其他功能（需要查看文档确认）

根据常见的 AI API，MiniMax 可能还支持：

1. **流式响应**
   - 实时输出 AI 生成的内容
   - 提升用户体验

2. **系统提示词（System Prompt）**
   - 定制 AI 角色和行为
   - 设置专业领域

3. **温度参数（Temperature）**
   - 控制输出的随机性
   - 0-1 之间的值

4. **停止序列（Stop Sequences）**
   - 自定义停止生成的标记

5. **Token 使用统计**
   - 输入 token 数
   - 输出 token 数
   - 总消耗统计

## 建议的下一步

1. 查看完整的 MiniMax 文档以了解：
   - 所有支持的模型
   - 完整的参数列表
   - 使用限制和配额
   - 最佳实践

2. 可能的功能扩展：
   - 添加流式响应支持
   - 实现系统提示词配置
   - 添加温度参数调节
   - 保存对话历史
   - 导出对话记录

## 测试建议

访问 `http://localhost:3001/minimaxm2` 测试以下场景：

1. **简单对话**
   - "你好"
   - "介绍一下你自己"

2. **复杂任务**
   - "写一首关于春天的诗"
   - "用简单的语言解释量子计算"
   - "帮我写一个 Python 函数来计算斐波那契数列"

3. **多轮对话**
   - 第一轮："什么是机器学习？"
   - 第二轮："它和深度学习有什么区别？"
   - 第三轮："能举个实际应用的例子吗？"
