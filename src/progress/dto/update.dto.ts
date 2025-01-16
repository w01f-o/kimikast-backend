import { IsBoolean, IsNumber } from 'class-validator';

export class UpdateProgressDto {
  @IsNumber()
  currentEpisode: number;

  @IsNumber()
  currentTime: number;

  @IsBoolean()
  isCompleted: boolean;
}
