import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from '../dtos/auth.dtos';
import { User } from '../decorators/user.decorators';
import { UserPayload } from 'src/interfaces/user.interfaces';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(ValidationPipe)
  @Post('signup')
  async signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @HttpCode(200)
  @UsePipes(ValidationPipe)
  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@User() user: UserPayload) {
    return {
      status: 'success',
      user,
    };
  }
}
