import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { DatabaseService } from '../database/database.service';
import { StorageService } from '../storage/storage.service';

@Module({
  controllers: [UserController],
  providers: [UserService, DatabaseService, StorageService],
  exports: [UserService],
})
export class UserModule {}
