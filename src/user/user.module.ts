import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { FriendModule } from './friend/friend.module';

@Module({
  imports: [FriendModule],
  controllers: [AuthController, UserController],
  providers: [AuthService, PrismaService, UserService],
})
export class UserModule {}
