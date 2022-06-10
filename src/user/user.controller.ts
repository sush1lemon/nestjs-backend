import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { Prisma } from '@prisma/client';
import { CreateUserDto } from './dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(@Body() body: CreateUserDto) {
    const user: Prisma.UserCreateInput = {
      ...body,
    };
    return this.userService.create(user);
  }
}
