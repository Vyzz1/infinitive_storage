import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PasswordService } from '../password/password.service';
import { PasswordModule } from '../password/password.module';

@Module({
  imports: [PasswordModule],
  providers: [AuthService, PasswordService],
  controllers: [AuthController],
})
export class AuthModule {}
