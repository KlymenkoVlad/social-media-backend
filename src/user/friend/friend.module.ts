import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { FriendRequestController } from './friend-request/friend-request.controller';
import { FriendRequestService } from './friend-request/friend-request.service';

@Module({
  providers: [FriendService, PrismaService, FriendRequestService],
  controllers: [FriendController, FriendRequestController],
})
export class FriendModule {}
