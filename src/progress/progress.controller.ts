import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { UpdateProgressDto } from './dto/update.dto';

@Auth()
@Controller('progress')
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Get()
  public async getProgresses(@CurrentUser('id') userId: string) {
    return this.progressService.getProgresses(userId);
  }

  @Get(':anilibriaSlug')
  public async getProgress(
    @CurrentUser('id') userId: string,
    @Param('anilibriaSlug') anilibriaSlug: string,
  ) {
    const { currentTime, currentEpisode, isCompleted } =
      await this.progressService.getProgress(userId, anilibriaSlug);

    return {
      currentTime,
      currentEpisode,
      isCompleted,
    };
  }

  @Patch(':anilibriaSlug')
  public async updateProgress(
    @CurrentUser('id') userId: string,
    @Param('anilibriaSlug') anilibriaSlug: string,
    @Body() dto: UpdateProgressDto,
  ) {
    const { currentTime, currentEpisode, isCompleted } =
      await this.progressService.updateProgress(userId, anilibriaSlug, dto);

    return {
      currentTime,
      currentEpisode,
      isCompleted,
    };
  }
}
