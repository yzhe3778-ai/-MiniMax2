# 📧 反馈功能配置指南

## 功能概述

主页面已添加反馈表单，用户可以提交：
- 姓名
- 邮箱
- 反馈内容

反馈目标邮箱：**le2932169@gmail.com**

## 当前实现

目前反馈功能使用**日志记录**方式，所有反馈会：
1. ✅ 在服务器控制台输出完整信息
2. ✅ 返回成功响应给用户
3. ✅ 包含表单验证（邮箱格式、内容长度等）

## 🚀 集成真实邮件服务

要让反馈真正发送到邮箱，你需要集成邮件服务。以下是几种推荐方案：

### 方案 1: Resend（推荐）

**优点**: 免费额度充足，API 简单，专为开发者设计

#### 1. 注册 Resend
- 访问：https://resend.com
- 注册账号并获取 API Key

#### 2. 安装依赖
```bash
npm install resend
```

#### 3. 配置环境变量
在 `.env.local` 中添加：
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
FEEDBACK_EMAIL=le2932169@gmail.com
```

#### 4. 更新 API 路由
编辑 `app/api/feedback/route.ts`，取消注释并修改：

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  // ... 验证代码 ...

  try {
    await resend.emails.send({
      from: 'feedback@yourdomain.com', // 需要验证的域名
      to: process.env.FEEDBACK_EMAIL || 'le2932169@gmail.com',
      subject: `新的用户反馈 - ${name}`,
      text: emailContent,
      replyTo: email, // 用户的邮箱作为回复地址
    });

    return NextResponse.json({
      success: true,
      message: '反馈已提交成功',
    });
  } catch (error) {
    console.error('发送邮件失败:', error);
    return NextResponse.json(
      { error: '发送失败，请重试' },
      { status: 500 }
    );
  }
}
```

### 方案 2: SendGrid

**优点**: 成熟稳定，免费额度 100 封/天

#### 1. 注册 SendGrid
- 访问：https://sendgrid.com
- 注册并获取 API Key

#### 2. 安装依赖
```bash
npm install @sendgrid/mail
```

#### 3. 配置环境变量
```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
FEEDBACK_EMAIL=le2932169@gmail.com
```

#### 4. 更新 API 路由
```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: NextRequest) {
  // ... 验证代码 ...

  try {
    await sgMail.send({
      to: process.env.FEEDBACK_EMAIL || 'le2932169@gmail.com',
      from: 'feedback@yourdomain.com', // 需要验证的邮箱
      subject: `新的用户反馈 - ${name}`,
      text: emailContent,
      replyTo: email,
    });

    return NextResponse.json({
      success: true,
      message: '反馈已提交成功',
    });
  } catch (error) {
    console.error('发送邮件失败:', error);
    return NextResponse.json(
      { error: '发送失败，请重试' },
      { status: 500 }
    );
  }
}
```

### 方案 3: Nodemailer (使用 Gmail SMTP)

**优点**: 免费，使用自己的 Gmail 账户

#### 1. 安装依赖
```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

#### 2. 配置 Gmail
- 访问 Google 账户设置
- 启用"两步验证"
- 生成"应用专用密码"

#### 3. 配置环境变量
```env
GMAIL_USER=le2932169@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

#### 4. 更新 API 路由
```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  // ... 验证代码 ...

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // 发给自己
      subject: `新的用户反馈 - ${name}`,
      text: emailContent,
      replyTo: email,
    });

    return NextResponse.json({
      success: true,
      message: '反馈已提交成功',
    });
  } catch (error) {
    console.error('发送邮件失败:', error);
    return NextResponse.json(
      { error: '发送失败，请重试' },
      { status: 500 }
    );
  }
}
```

### 方案 4: 保存到数据库

如果你不想立即发送邮件，可以先保存到数据库，然后定期查看：

```typescript
// 使用 Supabase, MongoDB, 或其他数据库
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  // ... 验证代码 ...

  try {
    const { error } = await supabase
      .from('feedback')
      .insert([
        {
          name,
          email,
          message,
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: '反馈已提交成功',
    });
  } catch (error) {
    console.error('保存反馈失败:', error);
    return NextResponse.json(
      { error: '提交失败，请重试' },
      { status: 500 }
    );
  }
}
```

## 📊 功能特性

### 已实现
- ✅ 表单验证（姓名、邮箱、内容）
- ✅ 邮箱格式验证
- ✅ 内容长度限制（10-1000 字符）
- ✅ 提交状态反馈（成功/失败）
- ✅ 加载状态显示
- ✅ 响应式设计
- ✅ 防重复提交
- ✅ 直接邮件链接（mailto）

### 表单字段
- **姓名**: 必填
- **邮箱**: 必填，格式验证
- **反馈内容**: 必填，10-1000 字符

### 用户体验
- 提交成功后自动清空表单
- 3 秒后自动隐藏成功提示
- 错误提示清晰明确
- 提供直接发送邮件的备选方案

## 🔒 安全建议

1. **API 密钥保护**
   - 永远不要将 API 密钥提交到 Git
   - 使用环境变量存储敏感信息
   - 在 `.gitignore` 中排除 `.env.local`

2. **速率限制**
   - 考虑添加反馈提交频率限制
   - 防止垃圾邮件和滥用

3. **内容过滤**
   - 添加敏感词过滤
   - 防止恶意内容提交

4. **验证码**
   - 对于公开网站，考虑添加 reCAPTCHA

## 📝 测试

### 本地测试
1. 启动开发服务器：`npm run dev`
2. 访问主页：`http://localhost:3000`
3. 滚动到底部的反馈表单
4. 填写并提交
5. 查看终端日志输出

### 验证内容
- [ ] 表单验证正常工作
- [ ] 成功提示显示正确
- [ ] 错误提示显示正确
- [ ] 邮件发送成功（配置邮件服务后）
- [ ] 控制台日志正确输出

## 🎯 推荐方案

对于你的项目，我推荐：

1. **快速上线**: 使用 **Nodemailer + Gmail**（方案 3）
   - 无需额外注册服务
   - 完全免费
   - 5 分钟内配置完成

2. **长期使用**: 使用 **Resend**（方案 1）
   - 专业的邮件服务
   - 免费额度充足（3000 封/月）
   - API 简单易用
   - 更好的送达率

## 📞 当前状态

✅ 反馈表单已添加到主页
✅ API 路由已创建
✅ 表单验证已实现
⏳ 邮件发送功能需要配置（见上述方案）

## 下一步

1. 选择一个邮件服务方案
2. 按照对应的配置步骤操作
3. 测试反馈功能
4. 部署到生产环境

---

如有问题，请查看：
- Resend 文档：https://resend.com/docs
- SendGrid 文档：https://docs.sendgrid.com
- Nodemailer 文档：https://nodemailer.com

