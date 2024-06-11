import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendService {
  constructor(private readonly prismaService: PrismaService) {}

  async deleteFriend(userId: number, friendId: string) {
    await this.prismaService.friend.deleteMany({
      where: {
        OR: [
          { userId, friendId: +friendId },
          { userId: +friendId, friendId: userId },
        ],
      },
    });

    await this.prismaService.friendRequest.deleteMany({
      where: {
        OR: [
          { senderId: userId, receiverId: +friendId },
          { senderId: +friendId, receiverId: userId },
        ],
      },
    });

    return;
  }

  async getFriendsWithPagination(userId: number, cursor?: number, take = 4) {
    const friends = await this.prismaService.friend.findMany({
      take: take + 1, // Fetch one extra record
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      where: {
        userId,
      },
      include: {
        friend: {
          select: {
            id: true,
            name: true,
            username: true,
            image_url: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    let hasNextPage = false;
    if (friends.length > take) {
      hasNextPage = true;
      friends.pop();
    }

    const nextCursor =
      friends.length > 0 ? friends[friends.length - 1].id : null;

    return {
      status: 'success',
      friends,
      nextCursor,
      hasNextPage,
      postsLength: friends.length,
    };
  }

  async getFriends(userId: number) {
    const friends = await this.prismaService.friend.findMany({
      where: {
        userId,
      },
      take: 7,
      include: {
        friend: {
          select: {
            id: true,
            name: true,
            username: true,
            image_url: true,
          },
        },
      },
    });

    return friends;
  }
}
