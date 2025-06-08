import { Test, TestingModule } from '@nestjs/testing';

import { EmailTestController } from './email.controller';
import { EmailService } from './email.service';

describe('EmailTestController', () => {
  let controller: EmailTestController;
  let emailService: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmailTestController],
      providers: [
        {
          provide: EmailService,
          useValue: { sendTestEmail: jest.fn() },
        },
      ],
    }).compile();

    controller = module.get<EmailTestController>(EmailTestController);
    emailService = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call sendTestEmail on the service', async () => {
    await controller.sendTest('test@example.com');
    expect(emailService.sendTestEmail).toHaveBeenCalledWith('test@example.com');
  });
});
