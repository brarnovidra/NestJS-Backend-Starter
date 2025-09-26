import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: true,
      auth: {
        user: process.env.SMTP_USER || 'your-email@gmail.com',
        pass: process.env.SMTP_PASS || 'your-password',
      },
    });
  }

  async sendWelcomeEmail(email: string, fullName?: string) {
    const subject = 'Welcome to Our Platform 🚀';
    const text = `Hello ${fullName || 'User'}, welcome to our platform!`;

    try {
      await this.transporter.sendMail({
        from: '"Our App" <no-reply@ourapp.com>',
        to: email,
        subject,
        text,
      });

      this.logger.log(`✅ Welcome email sent to ${email}`);
    } catch (error) {
      this.logger.error(`❌ Failed to send email to ${email}`, error.stack);
    }
  }
}
