import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { AuthGuard } from './common/guards/auth/auth.guard';
import { UserModule } from './modules/user/user.module';
import { PasswordModule } from './modules/password/password.module';
import { FileService } from './modules/file/file.service';
import { FolderService } from './modules/folder/folder.service';
import { FolderModule } from './modules/folder/folder.module';
import { FileModule } from './modules/file/file.module';
import { UploadModule } from './modules/upload/upload.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UserModule,
    PasswordModule,
    FolderModule,
    FileModule,
    UploadModule,
    QueueModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
    FileService,
    FolderService,
  ],
})
export class AppModule {}
