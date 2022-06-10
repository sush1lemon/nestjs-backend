import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async findByUnique(where: Prisma.UserWhereUniqueInput) {
    return this.prisma.user.findUnique({
      where: where,
    });
  }

  async findByIdAndRefresh(id: string, refresh: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
        refreshTokens: {
          some: {
            token: refresh,
          },
        },
      },
    });

    if (!user) throw new UnauthorizedException();
    return user;
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const check = await this.findByUnique({ username: data.username });
    if (check) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Username is already taken',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
    data.password = await bcrypt.hash(data.password, 12);
    return this.prisma.user.create({
      data,
    });
  }

  async pushRefreshToken(data: Prisma.UserRefreshTokenCreateInput) {
    return this.prisma.userRefreshToken.create({
      data,
    });
  }
}
