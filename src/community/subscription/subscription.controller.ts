import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/user/decorators/user.decorators';
import { UserPayload } from 'src/interfaces/user.interfaces';

@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post(':communityId')
  @UseGuards(AuthGuard)
  async subscribe(
    @User() user: UserPayload,
    @Param('communityId') communityId: string,
  ) {
    // console.log(communityId);
    return await this.subscriptionService.subscribe(user.id, +communityId);
  }

  @UseGuards(AuthGuard)
  @Delete(':communityId')
  async unsubscribe(
    @User() user: UserPayload,
    @Param('communityId') communityId: string,
  ) {
    return await this.subscriptionService.unsubscribe(user.id, +communityId);
  }

  @UseGuards(AuthGuard)
  @Get(':communityId')
  async getCommunitySubscriptions(@Param('communityId') communityId: string) {
    return await this.subscriptionService.getCommunitySubscriptions(
      +communityId,
    );
  }
}
