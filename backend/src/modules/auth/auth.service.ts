import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshTokenDto, SignUpDto } from './dto';
import db from 'src/db';
import { eq } from 'drizzle-orm';
import { User, users } from 'src/db/schema';
import { PasswordService } from '../password/password.service';
import { QueueService } from 'src/queue/queue.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from 'src/common/constants/jwt';
import { v7 as uuidv7 } from 'uuid';
@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly queueService: QueueService,
  ) {}

  private generateAccessToken(payload: Omit<User, 'password'>) {
    return this.jwtService.sign(payload, {
      secret: jwtConstants.access_secret as string,
      expiresIn: '2h',
      issuer: 'Infinite Storage',
    });
  }
  private generateJwtToken(payload: Omit<User, 'password'>) {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  private generateRefreshToken(payload: Omit<User, 'password'>) {
    const jti = uuidv7();
    return this.jwtService.sign(payload, {
      secret: jwtConstants.refresh_secret as string,
      expiresIn: '1d',
      jwtid: jti,
      issuer: 'Infinite Storage',
    });
  }

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

    const tokens = this.generateJwtToken(rest);
    return {
      tokens,
      user: rest,
    };
  }

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
        image: users.image,
        dob: users.dob,
        gender: users.gender,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    //TODO: send welcome email

    await this.queueService.publishWelcomeEmailTask(
      newUser.email,
      newUser.name,
    );

    const tokens = this.generateJwtToken(newUser);

    return {
      tokens,
      ...newUser,
    };
  }

  async refreshToken(body: RefreshTokenDto) {
    const { refreshToken } = body;

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: jwtConstants.refresh_secret,
      });

      const user = await db.query.users.findFirst({
        where: eq(users.id, payload.id),
      });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const token = await this.generateAccessToken(user);

      return {
        accessToken: token,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
