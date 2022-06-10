import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) { }
  async create(dto: CreatePostDto, user: User) {
    const post: Prisma.PostCreateInput = {
      title: dto.title,
      content: dto.content,
      subReddit: {
        connect: { id: dto.subRedditId },
      },
      user: {
        connect: { id: user.id },
      },
      upVotes: 0,
      downVotes: 0,
      commentCount: 0,
    };

    return this.prisma.post.create({ data: post });
  }

  async findAll(user: User) {
    return this.prisma.post.findMany({
      include: {
        user: true,
        subReddit: true,
        postVote: true,
        comments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findBySubreddit(subreddit: string) {
    return this.prisma.post.findMany({
      where: {
        subRedditId: subreddit,
      },
      include: {
        user: true,
        postVote: true,
        comments: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.post.findUnique({ where: { id: id }, include: { user: true } });
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
