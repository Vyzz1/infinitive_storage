import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from './dto';
import db from 'src/db';
import { eq } from 'drizzle-orm';
import { users } from 'src/db/schema';
import { PasswordService } from '../password/password.service';

@Injectable()
export class AuthService {
  async signIn(body: any) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, body.email),
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.passwordService.decryptSecret(
      user.password,
    );
    if (isPasswordValid !== body.password) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { password: _, ...rest } = user;
    return rest;
  }
  constructor(private readonly passwordService: PasswordService) {}

  async signUp(request: SignUpDto) {
    const findExist = await db.query.users.findFirst({
      where: eq(users.email, request.email),
    });

    if (findExist) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await this.passwordService.encryptSecret(
      request.password,
    );

    const [newUser] = await db
      .insert(users)
      .values({
        name: request.name,
        email: request.email,
        password: hashedPassword,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
      });

    //TODO: send welcome email

    return newUser;
  }
}
