import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createClient(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.createClient(createAuthDto);
  }

  @Post('login')
  loginClient(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.loginClient(createAuthDto);
  }

  @Post('admin/register')
  createAdmin(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.createAdmin(createAuthDto);
  }

  @Post('admin/login')
  loginAdmin(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.loginAdmin(createAuthDto);
  }
}
