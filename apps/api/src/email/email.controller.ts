import { Controller, Get, Query } from '@nestjs/common';

import { EmailService } from './email.service';

@Controller('email-test')
export class EmailTestController {
  constructor(private readonly emailService: EmailService) {}

  @Get()
  async sendTest(@Query('to') to: string) {
    await this.emailService.sendTestEmail(to);
    return { message: `Test email sent to ${to}` };
  }
}
