import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ListModule } from './list/list.module';
import { StorageModule } from './storage/storage.module';
import * as path from 'node:path';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'static'),
    }),
    AuthModule,
    UserModule,
    DatabaseModule,
    ListModule,
    StorageModule,
  ],
})
export class AppModule {}
