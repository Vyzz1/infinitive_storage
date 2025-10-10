import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthModule } from '../auth/auth.module';
import { PasswordModule } from '../password/password.module';

@Module({
  imports: [AuthModule, PasswordModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
