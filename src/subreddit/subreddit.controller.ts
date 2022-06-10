import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { SubredditService } from './subreddit.service';
import { CreateSubredditDto } from './dto/create-subreddit.dto';
import { UpdateSubredditDto } from './dto/update-subreddit.dto';
import { Request } from 'express';
import { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('subreddit')
export class SubredditController {
  constructor(private readonly subredditService: SubredditService) { }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() dto: CreateSubredditDto, @Req() req: Request) {
    const user = <User>req.user
    return this.subredditService.create(dto, user.id);
  }

  @Get()
  findAll() {
    return this.subredditService.findAll();
  }

  @Get('/name/:name')
  findByName(@Param('name') name: string) {
    return this.subredditService.findByName(name);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subredditService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubredditDto: UpdateSubredditDto) {
    return this.subredditService.update(+id, updateSubredditDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subredditService.remove(+id);
  }
}
