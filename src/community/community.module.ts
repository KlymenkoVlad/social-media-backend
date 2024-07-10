import { Module } from '@nestjs/common';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { SubscriptionService } from './subscription/subscription.service';
import { SubscriptionController } from './subscription/subscription.controller';

@Module({
  controllers: [CommunityController, SubscriptionController],
  providers: [CommunityService, PrismaService, SubscriptionService],
})
export class CommunityModule {}
