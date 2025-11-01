# 🎨 Logo 更换指南

## 📍 Logo 使用位置

你的 logo 在以下 4 个文件中使用：

1. **components/navbar.tsx** - 导航栏 logo
2. **app/minimaxm2/page.tsx** - MiniMax M2 页面 logo
3. **app/layout.tsx** - SEO 元数据图片
4. **app/manifest.ts** - PWA 应用图标

## 🔄 方法 1：直接替换（最简单）

### 步骤 1：准备 Logo 图片

**要求**：
- 文件名：`logo.png`
- 格式：PNG（推荐，支持透明背景）
- 建议尺寸：512x512 像素或更大
- 文件大小：< 500KB

**最佳实践**：
- 使用透明背景
- 高分辨率（至少 512x512）
- 正方形比例
- 清晰的品牌标识

### 步骤 2：替换文件

1. 找到你的新 logo 图片
2. 重命名为 `logo.png`
3. 复制到项目的 `public/` 目录
4. 覆盖原有的 `logo.png`

### 步骤 3：提交更改

```bash
git add public/logo.png
git commit -m "更新网站 logo"
git push origin master
```

### 步骤 4：验证

部署后访问以下页面检查：
- 主页导航栏
- MiniMax M2 页面
- 浏览器标签页图标

---

## 🔧 方法 2：使用不同文件名

如果你想使用不同的文件名（例如 `new-logo.png`），需要更新代码。

### 步骤 1：上传新 Logo

将新 logo 放到 `public/` 目录，例如：
```
public/new-logo.png
```

### 步骤 2：更新代码

我可以帮你批量更新所有文件中的 logo 引用。

需要更新的文件：
- `components/navbar.tsx`
- `app/minimaxm2/page.tsx`
- `app/layout.tsx`
- `app/manifest.ts`

---

## 📐 不同尺寸的 Logo（可选）

如果你想为不同位置使用不同尺寸的 logo：

### 推荐的 Logo 尺寸

```
public/
  ├── logo.png              # 主 logo (512x512)
  ├── logo-small.png        # 小尺寸 (64x64)
  ├── logo-og.png           # Open Graph (1200x630)
  └── favicon.ico           # 网站图标 (32x32)
```

### 用途说明

| 文件 | 尺寸 | 用途 |
|------|------|------|
| `logo.png` | 512x512 | 主 logo、导航栏 |
| `logo-small.png` | 64x64 | 小图标、移动端 |
| `logo-og.png` | 1200x630 | 社交媒体分享 |
| `favicon.ico` | 32x32 | 浏览器标签页 |

---

## 🎯 优化建议

### 1. 图片优化

使用在线工具压缩图片：
- **TinyPNG**: https://tinypng.com
- **Squoosh**: https://squoosh.app
- **ImageOptim**: https://imageoptim.com

目标：
- 保持清晰度
- 减小文件大小
- 提升加载速度

### 2. 多种格式

考虑提供多种格式：
```
public/
  ├── logo.png              # PNG 格式（透明背景）
  ├── logo.svg              # SVG 格式（矢量图）
  └── logo.webp             # WebP 格式（更小）
```

### 3. 响应式 Logo

为不同设备提供不同尺寸：
```typescript
// 示例：在 navbar.tsx 中
<Image
  src="/logo.png"
  alt="Logo"
  width={40}
  height={40}
  sizes="(max-width: 768px) 32px, 40px"
/>
```

---

## 🔍 常见问题

### Q1: Logo 不显示怎么办？

**检查清单**：
- [ ] 文件名是否正确（`logo.png`）
- [ ] 文件是否在 `public/` 目录
- [ ] 文件格式是否正确（PNG）
- [ ] 浏览器缓存是否清除（Ctrl+F5）

### Q2: Logo 显示模糊怎么办？

**解决方案**：
1. 使用更高分辨率的图片（至少 512x512）
2. 使用 SVG 格式（矢量图，永不模糊）
3. 在 Next.js Image 组件中设置 `quality={100}`

### Q3: Logo 背景不透明怎么办？

**解决方案**：
1. 使用 PNG 格式（支持透明）
2. 在图片编辑软件中移除背景
3. 使用在线工具：https://remove.bg

### Q4: Logo 文件太大怎么办？

**解决方案**：
1. 使用 TinyPNG 压缩
2. 转换为 WebP 格式
3. 降低分辨率（但保持清晰）

---

## 📝 快速更换步骤

### 如果你已有新 logo：

1. **重命名为 `logo.png`**
2. **复制到 `public/` 目录**
3. **覆盖原文件**
4. **提交并推送**
```bash
git add public/logo.png
git commit -m "更新 logo"
git push
```
5. **等待部署完成**
6. **清除浏览器缓存并刷新**

---

## 🎨 Logo 设计建议

如果你需要设计新 logo：

### 在线设计工具
- **Canva**: https://canva.com
- **Figma**: https://figma.com
- **LogoMaker**: https://logomaker.com

### 设计原则
1. **简洁明了** - 易于识别
2. **可扩展性** - 大小尺寸都清晰
3. **品牌一致** - 符合品牌色彩
4. **独特性** - 与众不同

### 推荐配色
根据你的网站主题（紫色）：
- 主色：`#9333ea`（紫色）
- 辅色：`#ec4899`（粉色）
- 文字：`#1f2937`（深灰）

---

## 💡 需要帮助？

如果你：
1. 有新的 logo 图片但不知道如何上传
2. 想使用不同的文件名
3. 需要批量更新代码

请告诉我：
- 新 logo 的文件名
- 是否需要我帮你更新代码

我会立即帮你完成更换！

---

## ✅ 更换完成检查清单

- [ ] Logo 文件已上传到 `public/` 目录
- [ ] 文件名为 `logo.png` 或已更新代码
- [ ] 图片格式正确（PNG/SVG）
- [ ] 图片尺寸合适（建议 512x512）
- [ ] 代码已提交并推送
- [ ] 网站已重新部署
- [ ] 浏览器缓存已清除
- [ ] 主页导航栏显示正常
- [ ] MiniMax M2 页面显示正常
- [ ] 浏览器标签页图标正常

---

**当前 Logo 位置**: `public/logo.png`

**准备好新 logo 了吗？告诉我文件名，我来帮你更新！**

