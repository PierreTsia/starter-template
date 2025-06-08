import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService
  ) {}

  async sendTestEmail(to: string, name: string): Promise<void> {
    await this.mailerService.sendMail({
      to,
      subject: 'Test Email',
      template: 'test',
      context: {
        name,
      },
    });
  }

  async sendConfirmationEmail(to: string, token: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    const confirmationUrl = `${frontendUrl}/confirm-email?token=${token}`;

    await this.mailerService.sendMail({
      to,
      subject: 'Confirm your email',
      template: 'confirmation',
      context: {
        confirmationUrl,
      },
    });
  }

  async sendPasswordResetEmail(to: string, token: string): Promise<void> {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    const resetUrl = `${frontendUrl}/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to,
      subject: 'Reset your password',
      template: 'reset-password',
      context: {
        resetUrl,
      },
    });
  }
}
