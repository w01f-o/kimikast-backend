import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { AuthDto } from '../auth/dto/auth.dto';
import { hash } from 'argon2';
import { StorageService } from '../storage/storage.service';
import { StaticLocation } from '../enums/StaticLocation.enum';

@Injectable()
export class UserService {
  public constructor(
    private readonly databaseService: DatabaseService,
    private readonly storageService: StorageService,
  ) {}

  public async findById(id: string) {
    return this.databaseService.user.findUnique({
      where: { id },
    });
  }

  public async findByEmail(email: string) {
    return this.databaseService.user.findUnique({ where: { email } });
  }

  public async findByUsername(name: string) {
    return this.databaseService.user.findUnique({ where: { name } });
  }

  public async create(dto: AuthDto) {
    const user = {
      email: dto.email,
      name: dto.name,
      password: await hash(dto.password),
    };

    const defaultUserLists = [
      { name: 'planned', isEditing: false },
      { name: 'watched', isEditing: false },
      { name: 'willBeWatching', isEditing: false },
      { name: 'watchingNow', isEditing: false },
      { name: 'abandoned', isEditing: false },
    ];

    return this.databaseService.user.create({
      data: {
        ...user,
        lists: {
          createMany: {
            data: defaultUserLists,
          },
        },
      },
    });
  }

  public async update(id: string, dto: AuthDto, avatar?: Express.Multer.File) {
    if (dto.password) dto.password = await hash(dto.password);

    if (avatar) {
      dto.avatar = await this.storageService.saveFile(
        avatar,
        StaticLocation.AVATAR,
      );
    }

    const { password, createdAt, updatedAt, ...user } =
      await this.databaseService.user.update({
        where: { id },
        data: {
          ...dto,
        },
      });

    return user;
  }

  public async delete(id: string) {
    const { password, createdAt, updatedAt, ...user } =
      await this.databaseService.user.delete({
        where: { id },
      });

    return user;
  }
}
