import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

interface CreatePostParams {
  title?: string;
  text: string;
  imageUrl?: string;
  userId: number;
}

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}

  async createPost(data: CreatePostParams) {
    const post = await this.prismaService.post.create({
      data: {
        title: data.title,
        text: data.text,
        image_url: data.imageUrl,
        user_id: data.userId,
      },
    });

    return {
      status: 'success',
      post,
    };
  }

  async getAllPosts() {
    const posts = await this.prismaService.post.findMany();

    return {
      status: 'success',
      posts,
    };
  }

  async getPostById(id: number) {
    const post = await this.prismaService.post.findUnique({
      where: {
        id,
      },
    });

    return {
      status: 'success',
      post,
    };
  }
}
