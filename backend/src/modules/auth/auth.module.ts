import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PasswordService } from '../password/password.service';
import { PasswordModule } from '../password/password.module';
import { QueueModule } from 'src/queue/queue.module';

@Module({
  imports: [PasswordModule, QueueModule],
  providers: [AuthService, PasswordService],
  controllers: [AuthController],
})
export class AuthModule {}
