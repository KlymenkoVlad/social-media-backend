import {
  Controller,
  Delete,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from '../decorators/user.decorators';
import { UserPayload } from 'src/interfaces/user.interfaces';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @UseGuards(AuthGuard)
  @Get('all/:userId')
  getFriendsWithPagination(
    @Param('userId') userId: number,
    @Query('cursor') cursor?: number,
    @Query('take') take = 3,
  ) {
    return this.friendService.getFriendsWithPagination(
      (userId = +userId),
      (cursor = +cursor),
      +take,
    );
  }

  @UseGuards(AuthGuard)
  @Get(':userId')
  getFriends(@Param('userId') userId: string) {
    return this.friendService.getFriends(+userId);
  }

  @UseGuards(AuthGuard)
  @Delete(':friendId')
  deleteFriend(@User() user: UserPayload, @Param('friendId') friendId: string) {
    return this.friendService.deleteFriend(user.id, friendId);
  }
}
