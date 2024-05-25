import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserByUsername(username: string) {
    const user = await this.prismaService.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      status: 'success',
      user,
    };
  }

  async deleteUser(id: number) {
    await this.prismaService.user.delete({
      where: { id },
    });
    return null;
  }

  async getAllUsers() {
    const users = await this.prismaService.user.findMany();
    return {
      status: 'success',
      users,
    };
  }
}
