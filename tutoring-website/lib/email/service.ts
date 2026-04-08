// src/lib/email/service.ts
import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  cc?: string | string[];
  bcc?: string | string[];
  replyTo?: string;
  attachments?: any[];
}

interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 10000,
      socketTimeout: 10000,
    });
  }

  async verify(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('✅ Email transporter ready to send messages');
      return true;
    } catch (error) {
      console.error('❌ Email transporter verification failed:', error);
      return false;
    }
  }

  async send({
    to,
    subject,
    text,
    html,
    cc,
    bcc,
    replyTo,
    attachments = [],
  }: EmailOptions): Promise<EmailResponse> {
    if (!to || !subject) {
      throw new Error("Email 'to' and 'subject' are required");
    }

    if (!text && !html) {
      throw new Error("Email must include either 'text' or 'html' content");
    }

    try {
      const info = await this.transporter.sendMail({
        from: `"${process.env.EMAIL_FROM_NAME || 'Tutoring App'}" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
        cc,
        bcc,
        replyTo: replyTo || process.env.EMAIL_USER,
        attachments,
        headers: {
          'X-Mailer': 'Nodemailer',
          Precedence: 'bulk',
        },
      });

      const recipients = Array.isArray(to) ? to.join(', ') : to;
      console.log(
        `✅ Email sent to ${recipients} | MessageId: ${info.messageId}`
      );

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error: any) {
      console.error('❌ Email sending failed:', {
        message: error.message,
        code: error.code,
        to,
        subject,
      });

      throw new Error(`Failed to send email: ${error.message}`);
    }
  }
}

export const emailService = new EmailService();