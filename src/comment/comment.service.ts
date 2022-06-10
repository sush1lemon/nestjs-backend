import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) { }

  create(dto: CreateCommentDto) {
    const data: Prisma.CommentCreateInput = {
      post: { connect: { id: dto.post_id } },
      user: { connect: { id: dto.user_id } },
      content: dto.content,
      upVotes: 0,
      downVotes: 0,
    }

    if (dto.parent_id) {
      data['parent'] = { connect: { id: dto.parent_id } }
    }

    return this.prisma.comment.create({ data })
  }

  findCommentsByPostId(id: string) {
    return this.prisma.comment.findMany({
      where: {
        postId: id,
        parentId: null,
      },
      include: {
        user: true,
        comments: { include: { comments: { include: { comments: { include: { comments: { include: { comments: true } } } } } } } },
      }
    })
  }

  findAll() {
    return `This action returns all comment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
