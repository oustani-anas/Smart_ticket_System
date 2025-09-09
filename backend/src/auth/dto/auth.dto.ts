
import { IsEmail,
  IsString,
  IsNotEmpty,
  IsBoolean,
  MinLength,
  Matches } from 'class-validator';

export class AuthDto {
  @IsString()
  id: string;

  @IsString()
  username: string;

  @IsString()
  avatar: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsBoolean()
  twoFactorAuthEnabled: boolean;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  // @Matches('password') // Ensure confirmPassword matches password
  confirmPassword: string;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  // @IsString()
  // @IsNotEmpty()
  // username: string;
}