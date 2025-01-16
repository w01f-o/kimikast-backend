import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [ProgressController],
  providers: [ProgressService, DatabaseService],
})
export class ProgressModule {}
