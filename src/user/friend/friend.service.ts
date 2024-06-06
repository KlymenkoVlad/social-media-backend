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

  async getFriends(userId: number) {
    const friends = await this.prismaService.friend.findMany({
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
    });

    return friends;
  }
}
