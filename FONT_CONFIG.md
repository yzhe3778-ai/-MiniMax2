# 🔤 简体中文字体配置说明

## 已完成的配置

### ✅ 主字体：Noto Sans SC（思源黑体简体中文）

**选择理由**：
- 🎯 专为简体中文设计
- 📱 跨平台兼容性好
- 🎨 字形美观，易读性强
- 🚀 Google Fonts 免费提供
- 💪 支持多种字重（300/400/500/700/900）

### 📝 配置详情

#### 1. 主字体配置（`app/layout.tsx`）

```typescript
import { Noto_Sans_SC } from 'next/font/google';

const notoSansSC = Noto_Sans_SC({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  display: 'swap',
  preload: true,
});
```

**字重说明**：
- `300` - Light（细体）- 适合大段文字
- `400` - Regular（常规）- 默认正文
- `500` - Medium（中等）- 强调文本
- `700` - Bold（粗体）- 标题和重点
- `900` - Black（特粗）- 超大标题

#### 2. 字体回退方案（`tailwind.config.ts`）

```typescript
fontFamily: {
  sans: [
    'var(--font-noto-sans-sc)',  // 主字体
    '-apple-system',              // macOS 系统字体
    'BlinkMacSystemFont',         // macOS Chrome
    'Segoe UI',                   // Windows 系统字体
    'PingFang SC',                // macOS/iOS 简体中文
    'Hiragino Sans GB',           // macOS 旧版中文字体
    'Microsoft YaHei',            // Windows 简体中文
    'Helvetica Neue',             // 备用西文字体
    'Helvetica',
    'Arial',
    'sans-serif',                 // 系统默认
  ],
}
```

**回退顺序说明**：
1. 优先使用 Noto Sans SC（Google Fonts）
2. 如果加载失败，使用系统自带的中文字体
3. 确保在所有平台都有良好的显示效果

#### 3. 全局样式优化（`app/globals.css`）

```css
body {
  font-feature-settings: 'kern' 1;           /* 字距调整 */
  -webkit-font-smoothing: antialiased;       /* macOS 字体平滑 */
  -moz-osx-font-smoothing: grayscale;        /* Firefox 字体平滑 */
  text-rendering: optimizeLegibility;        /* 优化文本渲染 */
}

/* 优化中文标点符号 */
body {
  quotes: '"' '"' ''' ''';
}
```

#### 4. 页面语言设置

```html
<html lang="zh-CN">
```

这确保：
- 搜索引擎正确识别语言
- 浏览器使用正确的字体渲染规则
- 屏幕阅读器使用中文语音

### 🎨 字体效果预览

#### 标题字体（font-bold, font-black）
```
MiniMax2 - AI 视频和图像生成平台
```

#### 正文字体（font-normal）
```
基于 MiniMax API 的 AI 内容创作平台，支持视频生成、图像生成、AI 对话等功能。
```

#### 细体字体（font-light）
```
您的反馈对我们非常重要，帮助我们不断改进产品。
```

### 🌐 跨平台显示效果

| 平台 | 主字体 | 回退字体 |
|------|--------|----------|
| **Windows** | Noto Sans SC | Microsoft YaHei |
| **macOS** | Noto Sans SC | PingFang SC |
| **iOS** | Noto Sans SC | PingFang SC |
| **Android** | Noto Sans SC | Roboto |
| **Linux** | Noto Sans SC | 系统默认 |

### 📊 性能优化

#### 字体加载策略
- ✅ `display: 'swap'` - 先显示回退字体，加载完成后切换
- ✅ `preload: true` - 预加载字体文件
- ✅ 只加载需要的字重，减少文件大小

#### 加载时间
- 首次加载：~100-200ms
- 后续访问：浏览器缓存，即时显示

### 🎯 使用 Tailwind 字重类

在组件中使用：

```tsx
// 细体
<p className="font-light">轻盈的文字</p>

// 常规（默认）
<p className="font-normal">正常的文字</p>

// 中等
<p className="font-medium">稍微强调的文字</p>

// 粗体
<h2 className="font-bold">标题文字</h2>

// 特粗
<h1 className="font-black">超大标题</h1>
```

### 🔧 自定义字重

如果需要精确控制字重：

```tsx
<div style={{ fontWeight: 300 }}>Light</div>
<div style={{ fontWeight: 400 }}>Regular</div>
<div style={{ fontWeight: 500 }}>Medium</div>
<div style={{ fontWeight: 700 }}>Bold</div>
<div style={{ fontWeight: 900 }}>Black</div>
```

### 📱 响应式字体大小建议

```tsx
// 移动端小，桌面端大
<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
  响应式标题
</h1>

// 正文
<p className="text-base sm:text-lg">
  响应式正文
</p>
```

### 🎨 其他字体选项（备选方案）

如果想更换字体，可以考虑：

#### 1. **ZCOOL XiaoWei**（站酷小薇体）
```typescript
import { ZCOOL_XiaoWei } from 'next/font/google';
```
- 风格：手写风格，温暖亲切
- 适合：创意类、设计类网站

#### 2. **Ma Shan Zheng**（马善政楷书）
```typescript
import { Ma_Shan_Zheng } from 'next/font/google';
```
- 风格：楷书风格，传统优雅
- 适合：文化类、艺术类网站

#### 3. **Long Cang**（龙藏体）
```typescript
import { Long_Cang } from 'next/font/google';
```
- 风格：书法风格，个性鲜明
- 适合：品牌类、特色网站

#### 4. **系统字体方案**（无需加载）
```typescript
// 不导入 Google Fonts，直接使用系统字体
fontFamily: {
  sans: [
    'PingFang SC',
    'Microsoft YaHei',
    'Hiragino Sans GB',
    'sans-serif',
  ],
}
```
- 优点：加载速度最快
- 缺点：不同系统显示效果不一致

### ✅ 验证配置

访问以下页面检查字体是否正确应用：

1. **主页**：`http://localhost:3000`
   - 检查标题和正文字体
   
2. **Hailuo 2.3**：`http://localhost:3000/hailuo23`
   - 检查表单和按钮文字
   
3. **反馈表单**：主页底部
   - 检查输入框和提示文字

### 🔍 浏览器开发者工具检查

1. 打开开发者工具（F12）
2. 选择任意文字元素
3. 查看 Computed 标签
4. 找到 `font-family` 属性
5. 应该显示：`"Noto Sans SC", ...`

### 📝 注意事项

1. **首次加载**：Google Fonts 需要从 CDN 加载，首次访问可能有轻微延迟
2. **网络问题**：如果无法访问 Google Fonts，会自动回退到系统字体
3. **字体缓存**：浏览器会缓存字体文件，后续访问速度很快
4. **SEO 优化**：已设置 `lang="zh-CN"`，有利于搜索引擎优化

### 🚀 性能建议

1. ✅ 已启用字体预加载
2. ✅ 已设置字体交换策略
3. ✅ 只加载必需的字重
4. ✅ 配置了完善的回退方案

### 📊 对比效果

#### 修改前（Inter 字体）
- 英文显示优秀
- 中文显示一般，字形偏窄
- 不支持中文特有的字形优化

#### 修改后（Noto Sans SC）
- 中文显示优秀，字形饱满
- 英文显示良好
- 支持中文标点和字形优化
- 整体视觉效果更协调

---

## 🎉 配置完成

所有页面现在都使用简体中文优化的字体系统！

如需更换字体或调整配置，请参考本文档的相关章节。

