import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResendConfirmationDto {
  @ApiProperty({
    description: 'Email address to resend confirmation to',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;
}
