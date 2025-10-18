import { IsEmail, IsString, MinLength } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @IsString()
  email: string;
  @IsString()
  @MinLength(6, {
    message: 'Password is too short. Minimum length is $constraint1 characters',
  })
  password: string;
  @IsString()
  @MinLength(2, {
    message: 'Name is too short. Minimum length is $constraint1 characters',
  })
  name: string;
}

export class RefreshTokenDto {
  @IsString()
  @MinLength(500, {
    message:
      'Refresh token is too short. Minimum length is $constraint1 characters',
  })
  refreshToken: string;
}
