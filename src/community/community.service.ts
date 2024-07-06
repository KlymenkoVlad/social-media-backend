import { Injectable, NotFoundException } from '@nestjs/common';
import { Colors } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

interface CreateCommunity {
  name: string;
  image_url: string;
  description?: string;
}

const CommunityInclude = {
  posts: true,
  user: {
    select: {
      username: true,
      image_url: true,
    },
  },
};

@Injectable()
export class CommunityService {
  constructor(private readonly prismaService: PrismaService) {}

  async createCommunity(userId: number, data: CreateCommunity) {
    console.log(data, userId);
    return await this.prismaService.community.create({
      data: {
        ...data,
        user_id: +userId,
      },
    });
  }

  async getAllCommunities(cursor?: number, take = 2, sortBy?: 'asc' | 'desc') {
    const communities = await this.prismaService.community.findMany({
      take: take + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      include: CommunityInclude,
      orderBy: {
        createdAt: sortBy || 'desc',
      },
    });

    let hasNextPage = false;
    if (communities.length > take) {
      hasNextPage = true;
      communities.pop();
    }

    const nextCursor =
      communities.length > 0 ? communities[communities.length - 1].id : null;

    return {
      status: 'success',
      communities,
      nextCursor,
      hasNextPage,
      communityLength: communities.length,
    };
  }

  async getCommunity(id: number) {
    const community = await this.prismaService.community.findUnique({
      where: {
        id,
      },
      include: CommunityInclude,
    });

    if (!community) {
      throw new NotFoundException('Community not found');
    }

    return community;
  }

  async deleteCommunity(id: number, userId: number) {
    const community = await this.prismaService.community.findUnique({
      where: {
        id,
      },
    });

    if (!community) {
      throw new NotFoundException('Community not found');
    }

    if (community.user_id !== userId) {
      throw new NotFoundException('You cannot delete this community');
    }

    await this.prismaService.community.delete({
      where: {
        id,
      },
    });

    return 'deleted';
  }

  async updateCommunity(
    id: number,
    userId: number,
    data: Partial<CreateCommunity>,
  ) {
    const community = await this.prismaService.community.findUnique({
      where: {
        id,
      },
    });

    if (!community) {
      throw new NotFoundException('Community not found');
    }

    if (community.user_id !== userId) {
      throw new NotFoundException('You cannot update this community');
    }

    return await this.prismaService.community.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
  }

  async updateColor(id: number, body: { color: string }) {
    await this.prismaService.community.update({
      where: { id },
      data: {
        profileColor: body.color as Colors,
      },
    });
  }

  async isCommunityExist(userId: number) {
    const community = await this.prismaService.community.findUnique({
      where: {
        user_id: userId,
      },
    });

    if (!community) {
      return {
        status: false,
      };
    }

    return {
      status: true,
    };
  }
}
