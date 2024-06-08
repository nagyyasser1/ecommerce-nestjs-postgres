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
  UnauthorizedException,
  HttpException,
  HttpStatus,
  Query,
  BadRequestException,
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
import { Cookies } from './decorators/cookies.decorator';
import { ForgetPassDto } from './dto/forget-pass.dto';
import { ResetPasswordDto } from './dto/reset-pass.dto';

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
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  @Post('register')
  createClient(@Body() createClientDto: CreateClientDto) {
    return this.authService.createClient(createClientDto);
  }

  @Post('login')
  async loginClient(
    @Res() res: Response,
    @Body() loginClientDto: LoginClientDto,
  ) {
    const { client, accessToken, refreshToken } =
      await this.authService.loginClient(loginClientDto);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.send({
      user: client,
      accessToken,
    });
  }

  @Post('admin/register')
  createAdmin(@Body() createAdminDto: CreateAdminDto) {
    return this.authService.createAdmin(createAdminDto);
  }

  @Post('admin/login')
  async loginAdmin(@Res() res: Response, @Body() loginAdminDto: LoginAdminDto) {
    const { admin, accessToken, refreshToken } =
      await this.authService.loginAdmin(loginAdminDto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.send({
      user: admin,
      accessToken,
    });
  }

  @Get('refresh')
  async refreshToken(@Cookies('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    return this.authService.refreshToken(refreshToken);
  }

  @Post('logout')
  logOut(@Cookies('refreshToken') refreshToken: string, @Res() res: Response) {
    if (!refreshToken) {
      throw new HttpException(
        {
          status: HttpStatus.NO_CONTENT,
          error: 'No refreshtoken provided',
        },
        HttpStatus.NO_CONTENT,
        {
          cause: 'No refreshtoken provided',
        },
      );
    }

    res.clearCookie('refreshToken');
    res.json({ message: 'Cookie cleared' });
  }

  @Post('forgotpassword')
  forgetpass(@Body() forgetPassDto: ForgetPassDto) {
    return this.authService.forgetPassword(forgetPassDto.email);
  }

  @Post('resetpassword')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }
}
