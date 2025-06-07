import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    format: 'email',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({
    description: 'User password (minimum 8 characters)',
    example: 'NewStrongP@ssw0rd',
    minLength: 8,
    required: false,
  })
  @IsString()
  @IsOptional()
  @MinLength(8)
  password?: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;
}
