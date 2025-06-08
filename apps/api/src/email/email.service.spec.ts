import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';

import { EmailService } from './email.service';

describe('EmailService', () => {
  let service: EmailService;
  let mailerService: MailerService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: MailerService,
          useValue: { sendMail: jest.fn() },
        },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('http://localhost:5173') },
        },
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    mailerService = module.get<MailerService>(MailerService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call sendMail on sendTestEmail', async () => {
    await service.sendTestEmail('test@example.com', 'Test User');
    expect(mailerService.sendMail).toHaveBeenCalledWith({
      to: 'test@example.com',
      subject: 'Test Email',
      template: 'test',
      context: {
        name: 'Test User',
      },
    });
  });

  it('should call sendMail on sendConfirmationEmail with default frontend URL', async () => {
    const token = 'test-token';
    await service.sendConfirmationEmail('test@example.com', token);
    expect(mailerService.sendMail).toHaveBeenCalledWith({
      to: 'test@example.com',
      subject: 'Confirm your email',
      template: 'confirmation',
      context: {
        confirmationUrl: 'http://localhost:5173/confirm-email?token=test-token',
      },
    });
  });

  it('should call sendMail on sendConfirmationEmail with custom frontend URL', async () => {
    const customUrl = 'https://myapp.com';
    jest.spyOn(configService, 'get').mockReturnValue(customUrl);
    const token = 'test-token';
    await service.sendConfirmationEmail('test@example.com', token);
    expect(mailerService.sendMail).toHaveBeenCalledWith({
      to: 'test@example.com',
      subject: 'Confirm your email',
      template: 'confirmation',
      context: {
        confirmationUrl: `${customUrl}/confirm-email?token=test-token`,
      },
    });
  });

  it('should call sendMail on sendPasswordResetEmail with default frontend URL', async () => {
    const token = 'test-token';
    await service.sendPasswordResetEmail('test@example.com', token);
    expect(mailerService.sendMail).toHaveBeenCalledWith({
      to: 'test@example.com',
      subject: 'Reset your password',
      template: 'reset-password',
      context: {
        resetUrl: 'http://localhost:5173/reset-password?token=test-token',
      },
    });
  });

  it('should call sendMail on sendPasswordResetEmail with custom frontend URL', async () => {
    const customUrl = 'https://myapp.com';
    jest.spyOn(configService, 'get').mockReturnValue(customUrl);
    const token = 'test-token';
    await service.sendPasswordResetEmail('test@example.com', token);
    expect(mailerService.sendMail).toHaveBeenCalledWith({
      to: 'test@example.com',
      subject: 'Reset your password',
      template: 'reset-password',
      context: {
        resetUrl: `${customUrl}/reset-password?token=test-token`,
      },
    });
  });
});
