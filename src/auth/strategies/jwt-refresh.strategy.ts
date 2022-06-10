import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.jwt;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.refresh_token_secret'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const refreshToken = req.cookies?.jwt;
    const user = await this.userService.findByIdAndRefresh(
      payload.user.id,
      refreshToken,
    );
    if (!user) throw UnauthorizedException;
    delete user['password'];
    return user;
  }
}
