import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { UserPayload } from 'src/interfaces/user.interfaces';
import { PrismaService } from 'src/prisma/prisma.service';
import * as FormData from 'form-data';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

interface CreatePostParams {
  title?: string;
  text: string;
  imageUrl?: string;
  communityId?: number;
}

const PostInclude = {
  likes: true,
  comments: {
    select: {
      text: true,
      userId: true,
      id: true,
      createdAt: true,
      updatedAt: true,
      postId: true,
      user: {
        select: {
          username: true,
          imageUrl: true,
        },
      },
    },
  },
  user: {
    select: {
      username: true,
      imageUrl: true,
    },
  },

  community: {
    select: {
      name: true,
      imageUrl: true,
      id: true,
      subscribed: true,
    },
  },
};

@Injectable()
export class PostService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async createPost(data: CreatePostParams, userId: number) {
    const post = await this.prismaService.post.create({
      data: {
        title: data.title,
        text: data.text,
        imageUrl: data.imageUrl,
        userId,
        communityId: data.communityId,
      },

      include: PostInclude,
    });

    return {
      status: 'success',
      post,
    };
  }

  async deletePost(id: number, userId: number) {
    await this.prismaService.post.delete({
      where: {
        id,
        userId,
      },
    });

    return null;
  }

  async getAllPosts(cursor?: number, take = 5, sortBy?: string) {
    // Fetch one extra record to check for next page

    const posts = await this.prismaService.post.findMany({
      take: take + 1, // Fetch one extra record
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0, // Skip the cursor record if cursor is provided
      include: PostInclude,

      orderBy: {
        createdAt: sortBy === 'old' ? 'asc' : 'desc',
      },
    });

    let hasNextPage = false;
    if (posts.length > take) {
      hasNextPage = true;
      posts.pop();
    }

    const nextCursor = posts.length > 0 ? posts[posts.length - 1].id : null;

    return {
      status: 'success',
      posts,
      nextCursor,
      hasNextPage,
      postsLength: posts.length,
    };
  }

  async getAllPostsByUserId(
    id: number,
    cursor?: number,
    sortBy?: string,
    take = 5,
  ) {
    const posts = await this.prismaService.post.findMany({
      where: {
        userId: id,
        communityId: null,
      },
      take: take + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      include: PostInclude,
      orderBy: {
        createdAt: sortBy === 'old' ? 'asc' : 'desc',
      },
    });

    let hasNextPage = false;
    if (posts.length > take) {
      hasNextPage = true;
      posts.pop();
    }

    const nextCursor = posts.length > 0 ? posts[posts.length - 1].id : null;

    return {
      status: 'success',
      posts,
      nextCursor,
      hasNextPage,
      postsLength: posts.length,
    };
  }

  async getAllPostsByCommunityId(
    id: number,
    cursor?: number,
    sortBy?: string,
    take = 5,
  ) {
    const posts = await this.prismaService.post.findMany({
      where: {
        communityId: id,
      },
      take: take + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      include: PostInclude,
      orderBy: {
        createdAt: sortBy === 'old' ? 'asc' : 'desc',
      },
    });

    let hasNextPage = false;
    if (posts.length > take) {
      hasNextPage = true;
      posts.pop();
    }

    const nextCursor = posts.length > 0 ? posts[posts.length - 1].id : null;

    return {
      status: 'success',
      posts,
      nextCursor,
      hasNextPage,
      postsLength: posts.length,
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

  async findPosts(text: string, cursor?: number, take = 5) {
    const posts = await this.prismaService.post.findMany({
      where: {
        OR: [
          { text: { contains: text, mode: 'insensitive' } },
          { title: { contains: text, mode: 'insensitive' } },
        ],
      },
      take: +take + 1,
      cursor: +cursor ? { id: +cursor } : undefined,
      skip: +cursor ? 1 : 0,
      include: PostInclude,
      orderBy: {
        createdAt: 'desc',
      },
    });

    let hasNextPage = false;
    if (posts.length > take) {
      hasNextPage = true;
      posts.pop();
    }

    const nextCursor = posts.length > 0 ? posts[posts.length - 1].id : null;

    return {
      status: 'success',
      posts,
      nextCursor,
      hasNextPage,
      postsLength: posts.length,
    };
  }

  async likePost(id: number, user: UserPayload) {
    const like = await this.prismaService.like.findUnique({
      where: { userId: user.id, postId: id },
    });

    if (like) {
      await this.prismaService.like.delete({
        where: { postId: id, userId: user.id },
      });
      return {
        status: 'deleted',
      };
    } else {
      return this.prismaService.like.create({
        data: {
          userId: user.id,
          postId: id,
        },
      });
    }
  }

  async commentPost(postId: number, text: string, user: UserPayload) {
    const post = await this.prismaService.post.findUnique({
      where: {
        id: postId,
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with id ${postId} does not exist`);
    }

    const comment = await this.prismaService.comment.create({
      data: {
        text,
        userId: user.id,
        postId: postId,
      },
      select: {
        text: true,
        userId: true,
        id: true,
        createdAt: true,
        updatedAt: true,
        postId: true,
        user: {
          select: {
            username: true,
          },
        },
      },
    });

    return comment;
  }

  async deleteComment(commentId: number, user: UserPayload) {
    const comment = await this.prismaService.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    if (comment.userId !== user.id) {
      throw new UnauthorizedException('You can only delete your own comments');
    }

    await this.prismaService.comment.delete({
      where: { id: commentId },
    });

    return 'deleted';
  }

  async imageUpload(file: Express.Multer.File): Promise<object> {
    const formData = new FormData();
    formData.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
    formData.append('upload_preset', 'social_media');

    try {
      const response = await lastValueFrom(
        this.httpService.post(
          `https://api.cloudinary.com/v1_1/${this.configService.get<string>('CLOUDINARY_NAME')}/image/upload`,
          formData,
          {
            headers: {
              ...formData.getHeaders(),
            },
          },
        ),
      );

      return {
        status: 'success',
        url: response.data.secure_url,
      };
    } catch (error) {
      console.error(
        'Error uploading image:',
        error.response?.data || error.message,
      );
      throw error;
    }
  }
}
