import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CommentPost, CreatePostDto } from './dtos/post.dtos';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/user/decorators/user.decorators';
import { UserPayload } from 'src/interfaces/user.interfaces';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Post()
  async createPost(@User() user: UserPayload, @Body() body: CreatePostDto) {
    return this.postService.createPost(body, user.id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @HttpCode(204)
  async deletePost(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserPayload,
  ) {
    return this.postService.deletePost(id, user.id);
  }

  @Get()
  async getAllPosts() {
    return this.postService.getAllPosts();
  }

  @UseGuards(AuthGuard)
  @Get('myposts')
  async getMyPosts(@User() user: UserPayload) {
    return this.postService.getMyPosts(user);
  }

  @Get(':id')
  async getPostById(@Param('id', ParseIntPipe) id: number) {
    return this.postService.getPostById(id);
  }

  @UseGuards(AuthGuard)
  @Post('like/:id')
  async likePost(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserPayload,
  ) {
    return this.postService.likePost(id, user);
  }

  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Post('comment/:postId')
  async commentPost(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() { text }: CommentPost,
    @User() user: UserPayload,
  ) {
    return this.postService.commentPost(postId, text, user);
  }

  @HttpCode(204)
  @UseGuards(AuthGuard)
  @Delete('comment/:commentId')
  async deleteComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @User() user: UserPayload,
  ) {
    return this.postService.deleteComment(commentId, user);
  }
}
