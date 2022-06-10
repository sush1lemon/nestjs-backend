import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.refresh_token_secret'),
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findByUnique({ id: payload.user.id });
    if (!user) throw UnauthorizedException;
    delete user['password'];
    return user;
  }
}
