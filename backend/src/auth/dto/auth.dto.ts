
import { match } from "assert";
import { IsEmail,
         IsString,
         IsNotEmpty,
         IsBoolean,
         MinLength,
         validate,
         MATCHES
        } from "class-validator";

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

export class LoginDto 
{
    @IsString()
    @IsNotEmpty()
    email: string
    
    @IsNotEmpty()
    password
}

export class RegisterDto 
{
    @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  @Match('password') // Ensure confirmPassword matches password
  confirmPassword: string;

  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: string;

  @IsString()
  @IsNotEmpty()
  username: string; // Optional: Add more fields like name, etc.
}
