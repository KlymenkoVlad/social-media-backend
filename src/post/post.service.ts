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
    // Fetch one extra record to check for next page
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
      orderBy: {
        id: 'desc',
      },
    });

    return {
      status: 'success',
      posts,
      postsLength: posts.length,
    };
  }

  async getAllInfiniteScrollPosts(cursor?: number, take = 2) {
    // Fetch one extra record to check for next page
    const posts = await this.prismaService.post.findMany({
      take: take + 1, // Fetch one extra record
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0, // Skip the cursor record if cursor is provided
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
      orderBy: {
        id: 'desc',
      },
    });

    let hasNextPage = false;
    if (posts.length > take) {
      hasNextPage = true;
      posts.pop(); // Remove the extra record
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
      where: {
        user_id: user.id,
      },
      take: 4,
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
      orderBy: {
        created_at: 'desc',
      },
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
