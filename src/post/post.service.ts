import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserPayload } from 'src/interfaces/user.interfaces';
import { PrismaService } from 'src/prisma/prisma.service';

interface CreatePostParams {
  title?: string;
  text: string;
  imageUrl?: string;
}

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}

  async createPost(data: CreatePostParams, userId: number) {
    const post = await this.prismaService.post.create({
      data: {
        title: data.title,
        text: data.text,
        image_url: data.imageUrl,
        user_id: userId,
      },
    });

    return {
      status: 'success',
      post,
    };
  }

  async getAllPosts() {
    const posts = await this.prismaService.post.findMany({
      include: {
        likes: true,
        comments: {
          select: {
            text: true,
            user_id: true,
            id: true,
            created_at: true,
            updated_at: true,
            post_id: true,
            user: {
              select: {
                username: true,
              },
            },
          },
        },
        user: {
          select: {
            username: true,
          },
        },
      },
    });

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

  async likePost(id: number, user: UserPayload) {
    const like = await this.prismaService.like.findUnique({
      where: { user_id: user.id, post_id: id },
    });

    if (like) {
      await this.prismaService.like.delete({
        where: { post_id: id, user_id: user.id },
      });
      return {
        status: 'deleted',
      };
    } else {
      return this.prismaService.like.create({
        data: {
          user_id: user.id,
          post_id: id,
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
        user_id: user.id,
        post_id: postId,
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

    if (comment.user_id !== user.id) {
      throw new UnauthorizedException('You can only delete your own comments');
    }

    return 'deleted';
  }

  async getMyPosts(user: UserPayload) {
    const posts = await this.prismaService.post.findMany({
      where: { user_id: user.id },
    });

    return posts;
  }

  async deletePost(id: number, userId: number) {
    await this.prismaService.post.delete({
      where: {
        id,
        user_id: userId,
      },
    });

    return null;
  }
}
