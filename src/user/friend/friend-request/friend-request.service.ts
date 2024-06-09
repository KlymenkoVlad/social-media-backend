import { ConflictException, Injectable } from '@nestjs/common';
import { FriendRequestStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendRequestService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllRequests(userId: number) {
    const requests = await this.prismaService.friendRequest.findMany({
      where: {
        receiverId: userId,
        status: FriendRequestStatus.PENDING,
      },
      include: {
        sender: {
          select: {
            username: true,
            name: true,
            id: true,
            image_url: true,
          },
        },
      },
    });

    return requests;
  }

  async sendRequestUserToUser(userId: number, userReceiverId: string) {
    const myRequest = await this.prismaService.friendRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: +userReceiverId,
      },
    });

    console.log(myRequest);

    if (myRequest && myRequest.status === FriendRequestStatus.DECLINED) {
      throw new ConflictException('Friend request declined');
    }
    if (myRequest && myRequest.status === FriendRequestStatus.ACCEPTED) {
      throw new ConflictException('Friend request already sent');
    }
    if (myRequest && myRequest.status === FriendRequestStatus.PENDING) {
      throw new ConflictException('Friend request already sent');
    }

    const friendRequest = await this.prismaService.friendRequest.findFirst({
      where: {
        senderId: +userReceiverId,
        receiverId: userId,
      },
    });

    console.log(friendRequest);

    if (friendRequest && friendRequest.status === FriendRequestStatus.PENDING) {
      await this.prismaService.friend.create({
        data: {
          userId: +userReceiverId,
          friendId: userId,
        },
      });

      await this.prismaService.friend.create({
        data: {
          userId,
          friendId: +userReceiverId,
        },
      });

      await this.prismaService.friendRequest.update({
        where: {
          senderId_receiverId: {
            senderId: +userReceiverId,
            receiverId: userId,
          },
        },
        data: {
          status: FriendRequestStatus.ACCEPTED,
        },
      });

      return {
        status: 'success',
        message: 'Friend request accepted',
      };
    }

    if (
      friendRequest &&
      friendRequest.status === FriendRequestStatus.ACCEPTED
    ) {
      throw new ConflictException('Friend request already sent');
    }

    const result = await this.prismaService.friendRequest.create({
      data: {
        senderId: userId,
        receiverId: +userReceiverId,
      },
    });

    return result;
  }

  async updateRequestStatus(
    userId: number,
    userSenderId: string,
    newStatus: FriendRequestStatus,
  ) {
    if (newStatus === FriendRequestStatus.PENDING) {
      return {
        status: 'error',
        message: 'Friend request already sent',
      };
    }

    const friendRequest = await this.prismaService.friendRequest.findFirst({
      where: {
        senderId: +userSenderId,
        receiverId: userId,
      },
    });

    if (
      friendRequest &&
      friendRequest.status === FriendRequestStatus.ACCEPTED
    ) {
      throw new ConflictException('Friend request already sent');
    }

    if (newStatus === FriendRequestStatus.ACCEPTED) {
      await this.prismaService.friend.create({
        data: {
          userId: +userSenderId,
          friendId: userId,
        },
      });

      await this.prismaService.friend.create({
        data: {
          userId,
          friendId: +userSenderId,
        },
      });

      await this.prismaService.friendRequest.update({
        where: {
          senderId_receiverId: {
            senderId: +userSenderId,
            receiverId: userId,
          },
        },
        data: {
          status: newStatus,
        },
      });

      return {
        status: 'success',
        message: 'Friend request accepted',
      };
    }

    const result = await this.prismaService.friendRequest.update({
      where: {
        senderId_receiverId: {
          senderId: +userSenderId,
          receiverId: userId,
        },
      },
      data: {
        status: newStatus,
      },
    });
    return result;
  }

  async getRequestStatus(userId: number, friendId: string) {
    const myRequest = await this.prismaService.friendRequest.findFirst({
      where: {
        senderId: userId,
        receiverId: +friendId,
      },
    });

    if (myRequest && myRequest.status === FriendRequestStatus.DECLINED) {
      return { status: FriendRequestStatus.DECLINED };
    }

    if (myRequest && myRequest.status === FriendRequestStatus.PENDING) {
      return { status: FriendRequestStatus.PENDING };
    }

    if (myRequest && myRequest.status === FriendRequestStatus.ACCEPTED) {
      return { status: FriendRequestStatus.ACCEPTED };
    }

    const friendRequest = await this.prismaService.friendRequest.findFirst({
      where: {
        senderId: +friendId,
        receiverId: userId,
      },
    });

    if (friendRequest && friendRequest.status === FriendRequestStatus.PENDING) {
      return { status: 'ACCEPT' };
    }

    if (
      friendRequest &&
      friendRequest.status === FriendRequestStatus.ACCEPTED
    ) {
      return { status: FriendRequestStatus.ACCEPTED };
    }

    return { status: 'NO_INTERACTIONS' };
  }
}
