import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from '../decorators/user.decorators';
import { UserPayload } from 'src/interfaces/user.interfaces';
import { UpdateRequestStatusDto } from '../dtos/friend.dtos';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @UseGuards(AuthGuard)
  @Post('request/:userReceiverId')
  sendRequestUserToUser(
    @User() user: UserPayload,
    @Param('userReceiverId') userReceiverId: string,
  ) {
    return this.friendService.sendRequestUserToUser(user.id, userReceiverId);
  }

  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Post('accept/:userSenderId')
  updateRequestStatus(
    @User() user: UserPayload,
    @Param('userSenderId') userSenderId: string,
    @Body() { newStatus }: UpdateRequestStatusDto,
  ) {
    return this.friendService.updateRequestStatus(
      user.id,
      userSenderId,
      newStatus,
    );
  }

  @UseGuards(AuthGuard)
  @Delete(':friendId')
  deleteFriend(@User() user: UserPayload, @Param('friendId') friendId: string) {
    return this.friendService.deleteFriend(user.id, friendId);
  }

  @UseGuards(AuthGuard)
  @Get(':friendId')
  async getRequest(
    @User() user: UserPayload,
    @Param('friendId') friendId: string,
  ) {
    return this.friendService.getRequest(user.id, friendId);
  }
}
