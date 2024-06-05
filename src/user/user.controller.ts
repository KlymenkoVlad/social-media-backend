import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './decorators/user.decorators';
import { AuthGuard } from 'src/guards/auth.guard';
import { UserPayload } from 'src/interfaces/user.interfaces';
import { UserUpdatePasswordDto, UserUpdateProfileDto } from './dtos/user.dtos';

//TODO: add update route

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  @UseGuards(AuthGuard)
  getMe(@User() user: UserPayload) {
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
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @HttpCode(204)
  @Delete('')
  @UseGuards(AuthGuard)
  deleteUser(@User() user: UserPayload) {
    return this.userService.deleteUser(user.id);
  }

  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @UseGuards(AuthGuard)
  @Patch('')
  async updateUser(
    @User() user: UserPayload,
    @Body() body: UserUpdateProfileDto,
  ) {
    try {
      await this.userService.updateUser(user.id, body);
      return;
    } catch (error) {
      throw new ConflictException(error.message);
    }
  }

  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @UseGuards(AuthGuard)
  @Patch('password')
  async updatePassword(
    @User() user: UserPayload,
    @Body() body: UserUpdatePasswordDto,
  ) {
    try {
      await this.userService.updatePassword(user.id, body);
      return;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
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

  @Get('username/:username')
  @UseGuards(AuthGuard)
  getUserByUsername(
    @Param('username') username: string,
    @Query('cursor') cursor?: number,
    @Query('take') take = 3,
  ) {
    return this.userService.getUsersByUsername(username, cursor, take);
  }
}
