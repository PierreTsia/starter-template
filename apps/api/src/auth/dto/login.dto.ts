import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export interface ILoginDto {
  email: string;
  password: string;
}

export class LoginDto implements ILoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
