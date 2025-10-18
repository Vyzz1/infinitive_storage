import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshTokenDto, SignUpDto } from './dto';
import { Public } from 'src/common/decorators/public/public.decorator';
import { type Request, type Response } from 'express';
import { User } from 'src/common/decorators/user/user.decorator';
import { AuthGuard } from 'src/common/guards/auth/auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @Post('sign-up')
  async signUp(
    @Body() body: SignUpDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const newUser = await this.authService.signUp(body);

    return res.status(201).json(newUser);
  }
  @Public()
  @Post('sign-in')
  async signIn(@Req() req: Request, @Res() res: Response) {
    const data = await this.authService.signIn(req.body);

    return res.status(200).json(data);
  }

  @Public()
  @Post('sign-out')
  async signOut(@Req() req: Request, @Res() res: Response) {
    return {
      message: 'Sign-out successful',
    };
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getCurrentUser(@User() user) {
    return user;
  }

  @Public()
  @Post('refresh')
  async refreshToken(@Body() body: RefreshTokenDto) {
    return this.authService.refreshToken(body);
  }
}
