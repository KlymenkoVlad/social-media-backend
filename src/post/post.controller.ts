import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dtos/post.dtos';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post()
  async createPost(@Body() body: CreatePostDto) {
    return this.postService.createPost(body);
  }

  @Get()
  async getAllPosts() {
    return this.postService.getAllPosts();
  }

  @Get(':id')
  async getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postService.getPostById(id);
  }
}
