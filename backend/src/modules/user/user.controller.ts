import { Controller, Put, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateProfileDto, ChangePasswordDto, UpdateAvatarDto } from './dto';
import { User } from 'src/common/decorators/user/user.decorator';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';

@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('profile')
  async updateProfile(@User() user: any, @Body() updateData: UpdateProfileDto) {
    return this.userService.updateProfile(user.id, updateData);
  }

  @Put('password')
  async changePassword(
    @User() user: any,
    @Body() changeData: ChangePasswordDto,
  ) {
    return this.userService.changePassword(user.id, changeData);
  }

  @Put('avatar')
  async updateAvatar(@User() user: any, @Body() updateData: UpdateAvatarDto) {
    return this.userService.updateAvatar(user.id, updateData);
  }
}
