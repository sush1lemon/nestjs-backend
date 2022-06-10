import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto, AuthResponseDto } from './dto';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { Prisma, User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @Post('signup')
  signup() {
    return this.authService.signup();
  }

  @Post('login')
  async login(@Body() dto: AuthDto, @Req() req: Request) {
    const auth = await this.authService.login(dto);
    if (!auth)
      throw new UnauthorizedException({
        message: 'Invalid username or password',
      });

    const { refreshToken, accessToken, user }: any = auth;

    const ip =
      (req.headers['x-forwarded-for'] as string) ||
      req.socket.remoteAddress ||
      'Unknown';

    const device = `${req.useragent?.os} ${req.useragent?.browser
      } ${req.useragent?.geoIp.toString()}`;

    const rfToken: Prisma.UserRefreshTokenCreateInput = {
      device: device,
      token: refreshToken,
      ip: ip,
      os: req.useragent?.os,
      platform: req.useragent?.platform,
      browser: req.useragent?.browser,
      source: req.useragent?.source,
      user: {
        connect: { id: user.id },
      },
    };

    await this.authService.pushRefreshToUser(rfToken);

    req.res.cookie('jwt', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'none',
      secure: true,
    });

    const response: AuthResponseDto = {
      access_token: accessToken,
      username: user.username,
      first_name: user.firstName,
      last_name: user.lastName,
    };

    return response;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  refresh(@Req() req: Request) {
    const user = req.user as User;
    const accessToken = this.authService.generateAccessToken(user);
    const response: AuthResponseDto = {
      access_token: accessToken,
      username: user.username,
      first_name: user.firstName,
      last_name: user.lastName,
    };

    return response;
  }

  @UseGuards(JwtRefreshGuard)
  @Get('logout')
  logout(@Req() req: Request) {
    const user = req.user as User;
    const refreshToken = req.cookies?.jwt;
    // this.authService.removeUserRefresh(user.id, refreshToken);

    req.res.cookie('jwt', refreshToken, {
      httpOnly: true,
      maxAge: 0,
      sameSite: 'none',
      secure: true,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('user')
  user(@Req() req: Request) {
    return req.user;
  }
}
