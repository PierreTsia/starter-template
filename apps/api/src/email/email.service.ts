import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly config: ConfigService
  ) {}

  async sendTestEmail(to: string) {
    await this.mailerService.sendMail({
      to,
      subject: 'Test Email',
      template: 'test',
      context: {
        name: 'Test User',
      },
    });
  }

  async sendConfirmationEmail(email: string, token: string) {
    const confirmationUrl = `${this.config.get('FRONTEND_URL')}/confirm-email?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Confirm your email',
      template: 'confirmation',
      context: {
        confirmationUrl,
      },
    });
  }

  async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${this.config.get('FRONTEND_URL')}/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset your password',
      template: 'reset-password',
      context: {
        resetUrl,
      },
    });
  }
}
