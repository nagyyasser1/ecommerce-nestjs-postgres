import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDto } from './dto/reset-pass.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import {
  LoginMethodReturnType,
  RefreshTokenMethodReturnType,
  UserWithoutPassword,
} from './types';
import { LoginUserDto } from './dto/login-user.dto';
import { UserType } from 'src/shared/utils/enums';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<UserWithoutPassword> {
    if (createUserDto.userType === UserType.ADMIN) {
      const adminsCount = await this.usersService.countAdmins();
      if (adminsCount > 0) {
        throw new ForbiddenException(
          'there are aready admins exists contact with them.',
        );
      }
    }

    const { password, ...data } = await this.usersService.create(createUserDto);
    return data;
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<LoginMethodReturnType> {
    let user: User;

    if (loginUserDto.userType === UserType.ADMIN) {
      user = await this.usersService.findOneByType(
        loginUserDto.email,
        loginUserDto.userType,
      );
    }

    if (user.authType != 'default') {
      throw new BadRequestException(
        'User registerd with another provider like google or facebook',
      );
    }

    const validPass = await bcrypt.compare(
      loginUserDto.password,
      user.password,
    );

    if (!validPass) {
      throw new BadRequestException(
        'Email or password not correct, Or you choosed another login method like (google, facebook, etc!)',
      );
    }

    const payload = { id: user.id, email: user.email, userType: user.userType };

    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<RefreshTokenMethodReturnType> {
    const decoded = await this.jwtService.verifyAsync(refreshToken);

    const user = await this.usersService.findOneByEmail(decoded.email);

    if (!user) {
      throw new NotFoundException(`user with id: ${decoded.id} not found.`);
    }

    const payload = {
      id: user.id,
      email: user.email,
      userType: user.userType,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }

  async forgetPassword(email: string): Promise<void> {
    const user = await this.usersService.findOneByEmail(email);

    const randomStr = Math.floor(100000 + Math.random() * 900000).toString();

    const token = await this.jwtService.signAsync({
      randomStr,
      user: user,
    });

    await this.usersService.update(user.id, { verifyToken: token });

    this.sendMail(
      'We have received a password reset request. Please use the below link to rest your password?',
      user.email,
      token,
    );
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const decoded = await this.jwtService.verifyAsync(resetPasswordDto.token);
    const user = await this.usersService.findOneByEmail(decoded.user.email);

    if (!user) {
      throw new NotFoundException(`${decoded.email} not found!`);
    }

    // Verify random string match
    const savedToken = user.verifyToken;

    const decodedSavedToken = await this.jwtService.verifyAsync(savedToken);

    if (decoded.randomStr !== decodedSavedToken.randomStr) {
      throw new UnprocessableEntityException('Invalid reset token');
    }

    // Update password and clear verification token
    const newHashedPass = bcrypt.hashSync(resetPasswordDto.password, 5);

    user.password = newHashedPass;
    user.verifyToken = '';

    await this.usersService.update(user.id, user);
  }

  private async sendMail(message: string, targetEmail: string, token: string) {
    const rediredUrl = this.configService.get('RESET_PASS_LINK');
    this.mailService.sendMail({
      from: 'Nagy Yasser <nagyy8751@gmail.com>',
      to: targetEmail,
      subject: 'Password change request recieved',
      text: message,
      html: `
      <h2>Click the link below to reset your password:</h2>
      <a href="${rediredUrl}/${token}" target="_blank">Reset Password</a>
      <p>This link will expire in 24 hours.</p>
    `,
    });
  }
}
