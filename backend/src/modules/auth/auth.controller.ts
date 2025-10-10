import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto';
import { Public } from 'src/common/decorators/public/public.decorator';
import { type Request, type Response } from 'express';
@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(
    @Body() body: SignUpDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const newUser = await this.authService.signUp(body);
    req.session.user = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      username: newUser.name.split(' ').join('').toLowerCase(),
    };
    return res.status(201).json(newUser);
  }

  @Post('sign-in')
  async signIn(@Req() req: Request, @Res() res: Response) {
    const data = await this.authService.signIn(req.body);
    req.session.user = {
      id: data.id,
      name: data.name,
      email: data.email,
      username: data.name.split(' ').join('').toLowerCase(),
    };
    return res.status(200).json(data);
  }

  @Post('sign-out')
  async signOut(@Req() req: Request, @Res() res: Response) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Could not sign out.' });
      }
      res.clearCookie('connect.sid');
      return res.status(200).json({ message: 'Signed out successfully.' });
    });
  }

  @Get('me')
  async getCurrentUser(@Req() req: Request) {
    return req.session.user || null;
  }
}
