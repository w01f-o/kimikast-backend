import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create.dto';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':slug')
  public async findAllByAnilibriaSlug(@Param('slug') anilibriaSlug: string) {
    return this.commentService.findAllByAnilibriaSlug(anilibriaSlug);
  }

  @Auth()
  @Post()
  public async create(
    @Body() dto: CreateCommentDto,
    @CurrentUser('id') userId: string,
  ) {
    return await this.commentService.create(dto, userId);
  }

  @Auth()
  @Delete(':id')
  public async delete(
    @Param('id') commentId: string,
    @CurrentUser('id') userId: string,
  ) {
    return await this.commentService.delete(commentId, userId);
  }
}
