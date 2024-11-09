import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  name: string;

  @IsOptional()
  @IsString()
  avatar: string;
}
