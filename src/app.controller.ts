import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { CreateUserDto } from './users/create-user.dto';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/login')
  async login(@Body() userItem: { username: string, password: string }) {
    return this.authService.login(userItem);
  }

  @Post('auth/register')
  async register(@Body() newUser: CreateUserDto) {
    return this.authService.register(newUser);
  }

}
