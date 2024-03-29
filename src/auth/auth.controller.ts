import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateClientDto } from './dto/create-client.dto';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginClientDto } from './dto/login-client.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import { ApiTags } from '@nestjs/swagger';
import { GoogleAuthGuard } from './guard/google.guard';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Client } from 'src/clients/entities/client.entity';

@ApiTags('auth')
@Controller('auth')
@UsePipes(ValidationPipe)
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin() {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleLoginCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { password, ...client } = req.user as Client;
    const payload = { sub: client.id, email: client.email, isAdmin: false };

    return {
      client,
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  @Post('register')
  createClient(@Body() createClientDto: CreateClientDto) {
    return this.authService.createClient(createClientDto);
  }

  @Post('login')
  loginClient(@Body() loginClientDto: LoginClientDto) {
    return this.authService.loginClient(loginClientDto);
  }

  @Post('admin/register')
  createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.authService.createAdmin(createAdminDto);
  }

  @Post('admin/login')
  loginAdmin(@Body() loginAdminDto: LoginAdminDto) {
    return this.authService.loginAdmin(loginAdminDto);
  }
}
