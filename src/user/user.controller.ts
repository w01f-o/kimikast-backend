import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { Auth } from '../auth/decorators/auth.decorator';
import { CurrentUser } from '../auth/decorators/user.decorator';
import { User } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateUserDto } from './dto/update.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @Get()
  public async findUser(@CurrentUser() user: User) {
    const { password, createdAt, updatedAt, ...data } = user;

    return data;
  }

  @Get('public/:name')
  public async findPublicUser(@Param('name') name: string) {
    const { password, createdAt, updatedAt, email, id, ...data } =
      await this.userService.findByUsername(name);

    return data;
  }

  @Auth()
  @Patch()
  @UseInterceptors(FileInterceptor('avatar'))
  public async updateUser(
    @CurrentUser('id') id: string,
    @Body() dto: UpdateUserDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    return this.userService.update(id, dto, avatar);
  }

  @Delete()
  public async deleteUser(@CurrentUser('id') id: string) {
    return this.userService.delete(id);
  }
}
