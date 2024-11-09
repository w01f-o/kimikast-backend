import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ListService } from './list.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { User } from '@prisma/client';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { UpdateListDto } from './dto/update.dto';
import { CreateListDto } from './dto/create.dto';
import { UpdateAnimeDto } from './dto/updateAnime.dto';

@Auth()
@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Get()
  public async findAll(@CurrentUser('id') userId: string) {
    return this.listService.findAll(userId);
  }

  @Get(':id')
  public async findById(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.listService.findById(id, userId);
  }

  @Post()
  public async create(@CurrentUser() user: User, @Body() dto: CreateListDto) {
    return this.listService.create(dto, user.id);
  }

  @Post(':id/add_anime')
  public async addAnime(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateAnimeDto,
    @Param('id') listId: string,
  ) {
    return this.listService.addAnime(listId, dto, userId);
  }

  @Post(':id/remove_anime')
  public async removeAnime(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateAnimeDto,
    @Param('id') id: string,
  ) {
    console.log(dto);
    return this.listService.removeAnime(id, dto, userId);
  }

  @Patch(':id')
  public async update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() dto: UpdateListDto,
  ) {
    return this.listService.update(id, dto, userId);
  }

  @Delete(':id')
  public async delete(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.listService.delete(id, userId);
  }
}
