import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json();

    // 验证必填字段
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: '请填写所有必填字段' },
        { status: 400 }
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: '请输入有效的邮箱地址' },
        { status: 400 }
      );
    }

    // 验证消息长度
    if (message.length < 10 || message.length > 1000) {
      return NextResponse.json(
        { error: '反馈内容长度应在 10-1000 个字符之间' },
        { status: 400 }
      );
    }

    // 构建邮件内容
    const emailContent = `
新的用户反馈

姓名: ${name}
邮箱: ${email}
时间: ${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}

反馈内容:
${message}

---
此邮件来自 MiniMax2 AI 平台反馈系统
    `.trim();

    console.log('收到反馈:', {
      name,
      email,
      messageLength: message.length,
      timestamp: new Date().toISOString(),
    });

    // 方案 1: 使用 mailto 链接（客户端发送）
    // 这种方式不需要服务器配置，但需要用户的邮件客户端
    
    // 方案 2: 如果你有 SMTP 服务，可以使用 nodemailer
    // 这里我们使用一个简单的方案：记录日志并返回成功
    // 实际生产环境中，你可能需要：
    // 1. 使用 SendGrid, AWS SES, 或其他邮件服务
    // 2. 保存到数据库
    // 3. 使用 webhook 发送到其他服务

    // 暂时只记录日志，实际部署时可以集成邮件服务
    console.log('=== 用户反馈详情 ===');
    console.log(emailContent);
    console.log('===================');

    // 可选：如果你想使用第三方邮件服务，可以在这里调用
    // 例如使用 Resend, SendGrid, 或 Mailgun
    
    // 示例：使用 fetch 发送到邮件服务（需要配置）
    /*
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'feedback@yourdomain.com',
          to: 'le2932169@gmail.com',
          subject: `新的用户反馈 - ${name}`,
          text: emailContent,
        }),
      });
    }
    */

    // 返回成功响应
    return NextResponse.json({
      success: true,
      message: '反馈已提交成功',
      data: {
        name,
        email,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('处理反馈时出错:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : '提交失败，请重试',
      },
      { status: 500 }
    );
  }
}

