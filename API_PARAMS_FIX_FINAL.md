# 🎯 MiniMax API 参数问题最终修复报告

## 📋 问题总结

通过分析日志发现的所有API参数问题：

### 1. ❌ 分辨率支持错误
**错误信息**: `model MiniMax-Hailuo-2.3 does not support resolution 720P, supported resolutions: 768P, 1080P`

**问题**: 代码中使用了 `720P`，但API只支持 `768P` 和 `1080P`

**✅ 修复**:
- 将分辨率类型从 `'720P' | '1080P'` 改为 `'768P' | '1080P'`
- 更新所有分辨率相关的UI组件

### 2. ❌ Fast模型限制
**错误信息**: `model MiniMax-Hailuo-2.3-Fast does not support Text-to-Video mode`

**问题**: Fast模型只支持图片转视频（I2V），不支持文字转视频（T2V）

**✅ 修复**:
- 在文字模式下隐藏 Fast 模型选项
- 切换到文字模式时自动将 Fast 模型改为标准模型
- 添加提示信息说明模型限制

### 3. ❌ 参数组合限制
**错误信息**: `model MiniMax-Hailuo-2.3 does not support the combination of duration 10s and resolution 1080P`

**问题**: Hailuo 2.3 不支持 10秒+1080P 的组合

**✅ 修复**:
- 选择10秒时，如果是1080P则自动切换到768P
- 选择1080P时，如果是10秒则禁用按钮或自动切换到6秒
- 添加警告提示

### 4. ❌ 余额不足
**错误信息**: `status_code: 1008, status_msg: 'insufficient balance'`

**问题**: 账户余额不足

**✅ 修复**:
- 添加友好的错误提示："MiniMax 账户余额不足，请充值后重试"
- 捕获错误码1008并显示中文提示

### 5. ✅ 视频URL域名
**问题**: 状态查询中使用了错误的域名 `api.minimax.chat`

**✅ 修复**:
- 改为正确的 `api.minimax.io`

---

## 🔧 修改的文件

### 1. [app/hailuo23/page.tsx](app/hailuo23/page.tsx)

#### 修改 1: 分辨率类型
```typescript
// 修改前
const [resolution, setResolution] = useState<'720P' | '1080P'>('1080P');

// 修改后
const [resolution, setResolution] = useState<'768P' | '1080P'>('1080P');
```

#### 修改 2: 模式切换自动处理
```typescript
<button
  onClick={() => {
    setMode('text');
    // 文字模式不支持 Fast 模型，自动切换
    if (selectedModel === 'MiniMax-Hailuo-2.3-fast') {
      setSelectedModel('MiniMax-Hailuo-2.3');
    }
  }}
>
  📝 文字转视频
</button>
```

#### 修改 3: 模型选择器
```typescript
<select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value as ModelType)}>
  <option value="MiniMax-Hailuo-2.3">Hailuo 2.3 (高质量)</option>
  {mode === 'image' && (
    <option value="MiniMax-Hailuo-2.3-fast">Hailuo 2.3 Fast (快速，仅限图片转视频)</option>
  )}
</select>
{mode === 'text' && (
  <p className="mt-2 text-xs text-gray-500">
    💡 Fast 模型仅支持图片转视频
  </p>
)}
```

#### 修改 4: 时长选择逻辑
```typescript
<button
  onClick={() => {
    // MiniMax-Hailuo-2.3 不支持 10秒 + 1080P 组合，应切换到 768P
    if (selectedModel === 'MiniMax-Hailuo-2.3' && resolution === '1080P') {
      setResolution('768P');
    }
    setDuration(10);
  }}
>
  10秒
</button>

{selectedModel === 'MiniMax-Hailuo-2.3' && duration === 10 && (
  <p className="mt-2 text-xs text-amber-600">
    ⚠️ Hailuo 2.3 的 10秒模式仅支持 768P
  </p>
)}
```

#### 修改 5: 分辨率选择器
```typescript
<div className="flex gap-2">
  <button
    onClick={() => setResolution('768P')}
    className={/* ... */}
  >
    768P
  </button>
  <button
    onClick={() => {
      // MiniMax-Hailuo-2.3 不支持 10秒 + 1080P 组合
      if (selectedModel === 'MiniMax-Hailuo-2.3' && duration === 10) {
        setDuration(6);
      }
      setResolution('1080P');
    }}
    disabled={isGenerating || (selectedModel === 'MiniMax-Hailuo-2.3' && duration === 10)}
  >
    1080P
    {selectedModel === 'MiniMax-Hailuo-2.3' && duration === 10 && ' (不可用)'}
  </button>
</div>
```

### 2. [app/api/hailuo23/status/route.ts](app/api/hailuo23/status/route.ts)

#### 修改: 视频URL域名
```typescript
// 修改前
video_url: data.file_id ? `https://api.minimax.chat/v1/files/retrieve?file_id=${data.file_id}` : null,

// 修改后
video_url: data.file_id ? `https://api.minimax.io/v1/files/retrieve?file_id=${data.file_id}` : null,
```

### 3. [app/api/hailuo23/generate/route.ts](app/api/hailuo23/generate/route.ts)

#### 修改: 错误处理
```typescript
if (!response.ok) {
  console.error('MiniMax API 错误:', data);

  // 处理特定错误
  let errorMessage = data.base_resp?.status_msg || data.message || '视频生成请求失败';

  // 余额不足
  if (data.base_resp?.status_code === 1008) {
    errorMessage = 'MiniMax 账户余额不足，请充值后重试';
  }
  // 参数错误
  else if (data.base_resp?.status_code === 2013) {
    errorMessage = `参数配置错误: ${data.base_resp.status_msg}`;
  }

  return NextResponse.json(
    { error: errorMessage, details: data },
    { status: response.status }
  );
}
```

---

## 📊 支持的参数组合表

### MiniMax-Hailuo-2.3

| 模式 | 时长 | 分辨率 | 状态 |
|------|------|--------|------|
| 文字/图片 | 6秒 | 768P | ✅ 支持 |
| 文字/图片 | 6秒 | 1080P | ✅ 支持 |
| 文字/图片 | 10秒 | 768P | ✅ 支持 |
| 文字/图片 | 10秒 | 1080P | ❌ **不支持** |

### MiniMax-Hailuo-2.3-fast

| 模式 | 时长 | 分辨率 | 状态 |
|------|------|--------|------|
| 文字 | 任意 | 任意 | ❌ **不支持** |
| 图片 | 6秒 | 768P | ✅ 支持 |
| 图片 | 6秒 | 1080P | ✅ 支持 |
| 图片 | 10秒 | 768P | ✅ 支持 |
| 图片 | 10秒 | 1080P | ✅ 支持 |

---

## ⚠️ 注意事项

### 1. 余额问题
当前测试账户余额不足，需要充值才能真正生成视频。错误会显示：
```
MiniMax 账户余额不足，请充值后重试
```

### 2. 图片上传
当前使用base64编码图片，可能不被API接受。生产环境建议：
- 先上传到云存储（AWS S3、Cloudinary等）
- 获取公网可访问的URL
- 将URL传给API

### 3. 参数自动调整逻辑
- **选择10秒时**: 如果当前是1080P，会自动切换到768P
- **选择1080P时**: 如果当前是10秒，按钮会被禁用
- **切换到文字模式**: 如果当前是Fast模型，会自动切换到标准模型

---

## 🧪 测试建议

### 测试用例 1: 标准模型 + 文字转视频
```
模型: MiniMax-Hailuo-2.3
模式: 文字转视频
时长: 6秒
分辨率: 1080P
提示词: "A cat running through a garden"
```

### 测试用例 2: 标准模型 + 10秒
```
模型: MiniMax-Hailuo-2.3
模式: 文字转视频
时长: 10秒
分辨率: 768P (自动)
提示词: "A sunset over the ocean"
```

### 测试用例 3: Fast模型 + 图片转视频
```
模型: MiniMax-Hailuo-2.3-fast
模式: 图片转视频
时长: 6秒
分辨率: 1080P
图片: 上传一张图片
描述: "Zoom in slowly"
```

### 测试用例 4: 参数限制验证
1. 选择标准模型
2. 选择10秒时长
3. 尝试选择1080P → 应该被禁用
4. 选择1080P
5. 尝试选择10秒 → 应该自动切换到768P

---

## 🎉 修复完成

所有已知的API参数问题都已修复：

✅ 分辨率改为 768P/1080P
✅ Fast模型仅在图片模式下可选
✅ 10秒+1080P组合自动处理
✅ 余额不足友好提示
✅ 视频URL域名正确

**下一步**:
1. **刷新浏览器页面**: http://localhost:3003/hailuo23
2. **测试参数限制**: 验证自动切换逻辑
3. **充值账户**: 解决余额不足问题以测试实际生成

---

## 📝 修复时间

**2025-11-01** (今天)

## 🤖 修复者

Claude Code (Sonnet 4.5)
