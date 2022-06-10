import { Injectable, UseFilters } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { AuthDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User, UserRefreshToken, Prisma } from '@prisma/client';


@Injectable()
@UseFilters()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async login(dto: AuthDto): Promise<object | null> {
    const user = await this.userService.findByUnique({ username: dto.username });
    if (!user) return null;
    const check = await bcrypt.compare(dto.password, user.password);
    if (!check) return null;

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.#generateRefreshToken(user, '1d');
    return { user, accessToken, refreshToken };
  }

  async pushRefreshToUser(refresh: Prisma.UserRefreshTokenCreateInput) {
    return this.userService.pushRefreshToken(refresh);
  }

  async removeUserRefresh(user_id: object, refreshToken: string) {
    // return this.userService.removeUserRefresh(user_id, refreshToken);
  }

  signup() {
    console.log('here');
    return 'asdasd';
  }

  generateAccessToken({ id }: User, expiration?: string): string {
    return this.jwtService.sign(
      { user: { id } },
      {
        secret: this.configService.get('jwt.access_token_secret'),
        expiresIn: expiration ?? '15m',
      },
    );
  }

  #generateRefreshToken({ id }: User, expiration?: string): string {
    return this.jwtService.sign(
      { user: { id } },
      {
        secret: this.configService.get('jwt.refresh_token_secret'),
        expiresIn: expiration ?? '1d',
      },
    );
  }
}
