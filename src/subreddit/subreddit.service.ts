import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSubredditDto } from './dto/create-subreddit.dto';
import { UpdateSubredditDto } from './dto/update-subreddit.dto';

@Injectable()
export class SubredditService {
  constructor(private prisma: PrismaService) { }
  async create(dto: CreateSubredditDto, admin: string) {
    const subReddit: Prisma.SubRedditCreateInput = {
      ...dto,
      members: 1,
      redditors: {
        create: {
          userId: admin,
        }
      }
    };

    return await this.prisma.subReddit.create({ data: subReddit });
  }

  findAll() {
    return this.prisma.subReddit.findMany();
  }

  findByName(name: string) {
    return this.prisma.subReddit.findFirst({ where: { name: name } })
  }

  findOne(id: number) {
    return `This action returns a #${id} subreddit`;
  }

  update(id: number, updateSubredditDto: UpdateSubredditDto) {
    return `This action updates a #${id} subreddit`;
  }

  remove(id: number) {
    return `This action removes a #${id} subreddit`;
  }
}
