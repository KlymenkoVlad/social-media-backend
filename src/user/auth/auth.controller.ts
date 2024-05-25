import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, SignupDto } from '../dtos/auth.dtos';

@Controller('')
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
}
