import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UpdateProgressDto } from './dto/update.dto';

@Injectable()
export class ProgressService {
  constructor(private readonly databaseService: DatabaseService) {}

  public async getProgresses(userId: string) {
    return this.databaseService.animeProgress.findMany({
      where: {
        userId,
      },
    });
  }

  public async getProgress(userId: string, anilibriaSlug: string) {
    return this.databaseService.animeProgress.findFirst({
      where: {
        AND: [{ userId }, { anilibriaSlug }],
      },
    });
  }

  public async updateProgress(
    userId: string,
    anilibriaSlug: string,
    dto: UpdateProgressDto,
  ) {
    return this.databaseService.animeProgress.upsert({
      where: {
        userId_anilibriaSlug: {
          userId,
          anilibriaSlug,
        },
      },
      create: {
        ...dto,
        user: {
          connect: {
            id: userId,
          },
        },
        anilibriaSlug,
      },
      update: {
        ...dto,
      },
    });
  }
}
