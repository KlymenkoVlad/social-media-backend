import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CommunityService } from './community.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { User } from 'src/user/decorators/user.decorators';
import { UserPayload } from 'src/interfaces/user.interfaces';
import {
  ColorUpdate,
  CreateCommunityDto,
  UpdateCommunityDto,
} from './dtos/community.dtos';

@Controller('community')
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @Post()
  @UseGuards(AuthGuard)
  async createCommunity(
    @User() user: UserPayload,
    @Body() data: CreateCommunityDto,
  ) {
    return await this.communityService.createCommunity(user.id, data);
  }

  @Get()
  @UseGuards(AuthGuard)
  async getAllCommunities(
    @Query('cursor') cursor?: number,
    @Query('take') take = 2,
    @Query('sortBy') sortBy?: 'asc' | 'desc',
  ) {
    return await this.communityService.getAllCommunities(
      (cursor = +cursor),
      (take = +take),
      sortBy,
    );
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMyCommunity(@User() user: UserPayload) {
    return await this.communityService.getMyCommunity(user.id);
  }

  @Get('exist')
  @UseGuards(AuthGuard)
  async isCommunityExist(@User() user: UserPayload) {
    return await this.communityService.isCommunityExist(user.id);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getCommunity(@Param('id', ParseIntPipe) id: number) {
    return await this.communityService.getCommunity(id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteCommunity(
    @User() user: UserPayload,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.communityService.deleteCommunity(id, user.id);
  }

  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @Patch('color')
  async updateColor(@User() user: UserPayload, @Body() body: ColorUpdate) {
    console.log(body);
    await this.communityService.updateColor(user.id, body);
  }

  @Patch('')
  @UseGuards(AuthGuard)
  async updateCommunity(
    @User() user: UserPayload,
    @Body() data: UpdateCommunityDto,
  ) {
    return await this.communityService.updateCommunity(user.id, data);
  }
}
