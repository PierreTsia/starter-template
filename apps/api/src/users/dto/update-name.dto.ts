import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MinLength, MaxLength } from 'class-validator';

export class UpdateNameDto {
  @ApiProperty({
    description: 'User full name (2-50 characters, letters, numbers, spaces and hyphens only)',
    example: 'John Doe',
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9\s-]+$/, {
    message: 'Name can only contain letters, numbers, spaces and hyphens',
  })
  name: string;
}
