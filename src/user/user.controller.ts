import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './decorators/user.decorators';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserPayload } from 'src/interfaces/user.interfaces';

//TODO: add update route

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  me(@User() user: UserPayload) {
    return {
      status: 'success',
      user: {
        id: user.id,
        username: user.username,
      },
    };
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getUserByUsername(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @HttpCode(204)
  @Delete('')
  @UseGuards(AuthGuard)
  deleteUser(@User() user: UserPayload) {
    return this.userService.deleteUser(user.id);
  }

  @Get('')
  @UseGuards(AuthGuard)
  async getAllUsers() {
    const users = await this.userService.getAllUsers();
    return {
      status: 'success',
      users,
    };
  }
}
