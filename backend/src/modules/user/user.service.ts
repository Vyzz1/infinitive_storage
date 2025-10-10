import {
  Injectable,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import db from 'src/db';
import { eq } from 'drizzle-orm';
import { users } from 'src/db/schema';
import { PasswordService } from '../password/password.service';
import { UpdateProfileDto, ChangePasswordDto, UpdateAvatarDto } from './dto';

@Injectable()
export class UserService {
  constructor(private readonly passwordService: PasswordService) {}

  async updateProfile(userId: string, updateData: UpdateProfileDto) {
    const [updatedUser] = await db
      .update(users)
      .set({
        name: updateData.name,
        dob: updateData.dob?.toDateString(),
        gender: updateData.gender,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
      });

    return updatedUser;
  }

  async changePassword(userId: string, changeData: ChangePasswordDto) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const decryptedPassword = await this.passwordService.decryptSecret(
      user.password,
    );
    if (decryptedPassword !== changeData.oldPassword) {
      throw new BadRequestException('Old password is incorrect');
    }

    const hashedNewPassword = await this.passwordService.encryptSecret(
      changeData.newPassword,
    );

    await db
      .update(users)
      .set({
        password: hashedNewPassword,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return { message: 'Password changed successfully' };
  }

  async updateAvatar(userId: string, updateData: UpdateAvatarDto) {
    const [updatedUser] = await db
      .update(users)
      .set({
        image: updateData.image,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
      });

    return updatedUser;
  }
}
