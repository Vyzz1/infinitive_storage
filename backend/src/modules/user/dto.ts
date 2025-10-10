import { Type } from 'class-transformer';
import {
  IsDate,
  IsOptional,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2, {
    message: 'Name is too short. Minimum length is $constraint1 characters',
  })
  name?: string;

  @Type(() => Date)
  @IsOptional()
  @IsDate()
  dob?: Date;

  @IsOptional()
  @IsString()
  gender?: string;
}

export class ChangePasswordDto {
  @IsString()
  @MinLength(6, {
    message: 'Password is too short. Minimum length is $constraint1 characters',
  })
  oldPassword: string;

  @IsString()
  @MinLength(6, {
    message: 'Password is too short. Minimum length is $constraint1 characters',
  })
  newPassword: string;
}

export class UpdateAvatarDto {
  @IsUrl()
  @IsString()
  image: string;
}
