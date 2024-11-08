import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { AuthDto } from '../auth/dto/auth.dto';
import { hash } from 'argon2';

@Injectable()
export class UserService {
  public constructor(private readonly databaseService: DatabaseService) {}

  public async findById(id: string) {
    return this.databaseService.user.findUnique({
      where: { id },
    });
  }

  public async findByEmail(email: string) {
    return this.databaseService.user.findUnique({ where: { email } });
  }

  public async create(dto: AuthDto) {
    const user = {
      email: dto.email,
      name: dto.name,
      password: await hash(dto.password),
    };

    const defaultUserLists = [
      { name: 'planned', isDeleting: false },
      { name: 'watched', isDeleting: false },
      { name: 'willBeWatching', isDeleting: false },
      { name: 'watchingNow', isDeleting: false },
      { name: 'abandoned', isDeleting: false },
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
}
