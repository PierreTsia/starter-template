import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export interface IRegisterDto {
  email: string;
  password: string;
  name?: string;
}

export class RegisterDto implements IRegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  name?: string;
}
