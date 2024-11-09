import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateListDto {
  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  isPublic: boolean;
}
