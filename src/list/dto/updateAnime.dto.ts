import { IsString } from 'class-validator';

export class UpdateAnimeDto {
  @IsString()
  anilibriaSlug: string;
}
