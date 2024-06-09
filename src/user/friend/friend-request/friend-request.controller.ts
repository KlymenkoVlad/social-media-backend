import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FriendRequestService } from './friend-request.service';
import { User } from 'src/user/decorators/user.decorators';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserPayload } from 'src/interfaces/user.interfaces';
import { UpdateRequestStatusDto } from 'src/user/dtos/friend.dtos';

@Controller('request')
export class FriendRequestController {
  constructor(private readonly friendRequestService: FriendRequestService) {}

  @UseGuards(AuthGuard)
  @Get('')
  async getAllRequest(@User() user: UserPayload) {
    return this.friendRequestService.getAllRequests(user.id);
  }

  @UseGuards(AuthGuard)
  @Post('send/:userReceiverId')
  sendRequestUserToUser(
    @User() user: UserPayload,
    @Param('userReceiverId') userReceiverId: string,
  ) {
    return this.friendRequestService.sendRequestUserToUser(
      user.id,
      userReceiverId,
    );
  }

  @UseGuards(AuthGuard)
  @Get('status/:friendId')
  async getRequest(
    @User() user: UserPayload,
    @Param('friendId') friendId: string,
  ) {
    return this.friendRequestService.getRequestStatus(user.id, friendId);
  }

  @UseGuards(AuthGuard)
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard)
  @Post('accept/:userSenderId')
  updateRequestStatus(
    @User() user: UserPayload,
    @Param('userSenderId') userSenderId: string,
    @Body() { newStatus }: UpdateRequestStatusDto,
  ) {
    return this.friendRequestService.updateRequestStatus(
      user.id,
      userSenderId,
      newStatus,
    );
  }
}
