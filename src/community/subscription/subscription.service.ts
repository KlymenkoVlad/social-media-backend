import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

export const SubscriptionInclude = {
  user: {
    select: {
      imageUrl: true,
      id: true,
      username: true,
    },
  },
};

@Injectable()
export class SubscriptionService {
  constructor(private readonly prismaService: PrismaService) {}

  async subscribe(userId: number, communityId: number) {
    const subscription = await this.prismaService.subscription.findFirst({
      where: {
        userId,
        communityId,
      },
    });

    if (subscription) {
      throw new ConflictException('Already subscribed');
    }

    return this.prismaService.subscription.create({
      data: {
        userId,
        communityId,
      },
      include: SubscriptionInclude,
    });
  }

  getCommunitySubscriptions(communityId: number) {
    const community = this.prismaService.community.findUnique({
      where: {
        id: communityId,
      },
    });

    if (!community) {
      throw new NotFoundException('Community not found');
    }

    return this.prismaService.subscription.findMany({
      where: {
        communityId,
      },
      include: SubscriptionInclude,
    });
  }

  async unsubscribe(userId: number, communityId: number) {
    const user = this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const community = this.prismaService.community.findUnique({
      where: {
        id: communityId,
      },
    });

    if (!community) {
      throw new NotFoundException('Community not found');
    }

    await this.prismaService.subscription.delete({
      where: {
        userId,
        communityId,
      },
    });

    return {
      status: 'success',
    };
  }
}
