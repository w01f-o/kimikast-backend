import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  name: string;

  @IsOptional()
  password: string;

  @IsOptional()
  @IsString()
  avatar: string;
}
