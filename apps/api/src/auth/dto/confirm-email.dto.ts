import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmEmailDto {
  @ApiProperty({
    description: 'Email confirmation token',
    example: 'abc123...',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}
