import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateListDto } from './dto/create.dto';
import { UpdateListDto } from './dto/update.dto';
import { UpdateAnimeDto } from './dto/updateAnime.dto';

@Injectable()
export class ListService {
  public constructor(private readonly databaseService: DatabaseService) {}

  public async findAll(userId: string) {
    return this.databaseService.list.findMany({
      where: {
        userId,
      },
      include: {
        animes: true,
      },
    });
  }

  public async findById(id: string, userId: string) {
    return this.databaseService.list.findUnique({
      where: {
        userId,
        id,
      },
      include: {
        animes: true,
      },
    });
  }

  public async create(dto: CreateListDto, userId: string) {
    return this.databaseService.list.create({
      data: {
        ...dto,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  public async update(id: string, dto: UpdateListDto, userId: string) {
    return this.databaseService.list.update({
      where: {
        userId,
        id,
        isEditing: true,
      },
      data: {
        ...dto,
      },
    });
  }

  public async delete(id: string, userId: string) {
    return this.databaseService.list.delete({
      where: {
        userId,
        id,
        isEditing: true,
      },
    });
  }

  public async addAnime(listId: string, dto: UpdateAnimeDto, userId: string) {
    return this.databaseService.list.update({
      where: {
        userId,
        id: listId,
      },
      data: {
        animes: {
          create: {
            ...dto,
          },
        },
      },
    });
  }

  public async removeAnime(
    listId: string,
    dto: UpdateAnimeDto,
    userId: string,
  ) {
    return this.databaseService.list.update({
      where: {
        userId,
        id: listId,
      },
      data: {
        animes: {
          deleteMany: {
            anilibriaSlug: dto.anilibriaSlug,
          },
        },
      },
    });
  }
}
