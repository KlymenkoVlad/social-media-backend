import { FriendRequestStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateRequestStatusDto {
  @IsEnum(FriendRequestStatus)
  newStatus: FriendRequestStatus;
}
