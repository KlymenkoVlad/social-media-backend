import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  HttpCode,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CommentPostDto, CreatePostDto } from './dtos/post.dtos';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/user/decorators/user.decorators';
import { UserPayload } from 'src/interfaces/user.interfaces';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

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
  async getAllPosts(
    @Query('cursor') cursor?: number,
    @Query('take') take = 2,
    @Query('sortBy') sortBy?: string,
  ) {
    return this.postService.getAllPosts(
      (cursor = +cursor),
      (take = +take),
      sortBy,
    );
  }

  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @Get('search/:text')
  async findPosts(
    @Param('text') text: string,
    @Query('cursor') cursor?: number,
    @Query('take') take = 2,
  ) {
    return this.postService.findPosts(text, cursor, take);
  }

  @UseGuards(AuthGuard)
  @Get('user/:id')
  async getAllPostsByUserId(
    @Param('id', ParseIntPipe) id: number,
    @Query('cursor') cursor?: number,
    @Query('take') take = 2,
    @Query('sortBy') sortBy?: string,
  ) {
    return this.postService.getAllPostsByUserId(id, +cursor, sortBy, +take);
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
    @Body() { text }: CommentPostDto,
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

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.postService.imageUpload(file);
  }
}
