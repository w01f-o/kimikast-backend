import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateCommentDto } from './dto/create.dto';

@Injectable()
export class CommentService {
  public constructor(private readonly databaseService: DatabaseService) {}

  public async findAllByAnilibriaSlug(slug: string) {
    return this.databaseService.comment.findMany({
      where: {
        anilibriaSlug: slug,
      },
    });
  }

  public async create(
    { anilibriaSlug, content }: CreateCommentDto,
    userId: string,
  ) {
    return this.databaseService.comment.create({
      data: {
        anilibriaSlug,
        content,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  public async delete(commentId: string, userId: string) {
    return this.databaseService.comment.delete({
      where: {
        id: commentId,
        userId,
      },
    });
  }
}
