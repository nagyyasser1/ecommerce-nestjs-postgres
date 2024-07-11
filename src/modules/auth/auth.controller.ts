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
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { GoogleAuthGuard } from './guard/google.guard';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Cookies } from './decorators/cookies.decorator';
import { ForgetPassDto } from './dto/forget-pass.dto';
import { ResetPasswordDto } from './dto/reset-pass.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from '../users/entities/user.entity';

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
    const { password, ...user } = req.user as User;
    const payload = { id: user.id, email: user.email, userType: user.userType };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    res.cookie('accessToken', accessToken, {
      httpOnly: false,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('user', JSON.stringify(user), {
      httpOnly: false,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Redirect to React app with tokens as query parameters
    const redirectUrl = `${process.env.CLIENT_URL}/auth/google/callback`;
    res.redirect(redirectUrl);
  }

  @Post('register')
  createUser(@Body() createUser: CreateUserDto) {
    return this.authService.createUser(createUser);
  }

  @Post('login')
  async loginUser(@Res() res: Response, @Body() loginUserDto: LoginUserDto) {
    const { user, accessToken, refreshToken } =
      await this.authService.loginUser(loginUserDto);
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'none',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.send({
      user,
      accessToken,
    });
  }

  @Get('refresh')
  async _refreshToken(@Cookies('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token provided');
    }

    return this.authService.refreshAccessToken(refreshToken);
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
