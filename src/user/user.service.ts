import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

interface UpdateUserParams {
  email: string;
  name: string;
  username: string;
  surname: string;
  age: number;
  image_url: string;
  description: string;
}

interface UpdatePasswordsParams {
  oldPassword: string;
  newPassword: string;
}

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async getMe(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    return user;
  }

  async getUserById(id: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
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

  async getRecommendedUsers(userId: number) {
    const users = await this.prismaService.user.findMany({
      where: {
        AND: [
          {
            id: {
              not: userId,
            },
          },
          {
            id: {
              not: userId,
              notIn: [
                ...(
                  await this.prismaService.friendRequest.findMany({
                    where: {
                      OR: [{ senderId: userId }, { receiverId: userId }],
                    },
                    select: {
                      senderId: true,
                      receiverId: true,
                    },
                  })
                ).flatMap((request) => [request.senderId, request.receiverId]),
              ],
            },
          },
        ],
      },
      select: {
        id: true,
        image_url: true,
        username: true,
        name: true,
      },
      take: 4,
    });

    return users;
  }

  async getUsersByUsername(username: string, cursor?: number, take = 3) {
    const users = await this.prismaService.user.findMany({
      where: {
        username: {
          contains: username,
          mode: 'insensitive',
        },
      },
      take: +take + 1,
      cursor: +cursor ? { id: +cursor } : undefined,
      skip: +cursor ? 1 : 0,
      orderBy: {
        created_at: 'desc',
      },
    });

    let hasNextPage = false;
    if (users.length > take) {
      hasNextPage = true;
      users.pop();
    }

    const nextCursor = users.length > 0 ? users[users.length - 1].id : null;

    return {
      status: 'success',
      users,
      nextCursor,
      hasNextPage,
      usersLength: users.length,
    };
  }

  async updateUser(id: number, user: UpdateUserParams) {
    if (user.email) {
      const userExists = await this.prismaService.user.findUnique({
        where: { email: user.email },
      });
      if (userExists && userExists.id !== id) {
        throw new Error('This email is already in use');
      }
    }

    if (user.username) {
      const userExists = await this.prismaService.user.findUnique({
        where: { username: user.username },
      });
      if (userExists && userExists.id !== id) {
        throw new Error('This username is already in use');
      }
    }

    if (user.age) {
      user.age = +user.age;
    }

    await this.prismaService.user.update({
      where: { id },
      data: user,
    });

    return;
  }

  async updatePassword(id: number, passwords: UpdatePasswordsParams) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
    });

    const isValidPassword = await bcrypt.compare(
      passwords.oldPassword,
      user.password,
    );

    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    const hashedPassword = await bcrypt.hash(passwords.newPassword, 12);
    await this.prismaService.user.update({
      where: { id },
      data: { password: hashedPassword },
    });

    return;
  }
}
