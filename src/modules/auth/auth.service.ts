import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { AdminsService } from 'src/modules/admins/admins.service';
import { ClientsService } from 'src/modules/clients/clients.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginClientDto } from './dto/login-client.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Client } from 'src/modules/clients/entities/client.entity';
import { Admin } from 'src/modules/admins/entities/admin.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { ResetPasswordDto } from './dto/reset-pass.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminsService,
    private readonly clientService: ClientsService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async createClient(createClientDto: CreateClientDto) {
    const { password, ...client } =
      await this.clientService.create(createClientDto);
    return client;
  }

  async createAdmin(createAdminDto: CreateAdminDto) {
    const { password, ...admin } =
      await this.adminService.create(createAdminDto);
    return admin;
  }

  async loginClient(loginClientDto: LoginClientDto) {
    const client = await this.clientService.findOneByEmail(
      loginClientDto.email,
    );

    if (!client) {
      throw new NotFoundException('Email not found!');
    }

    const validPass = await bcrypt.compare(
      loginClientDto.password,
      client.password,
    );

    if (!validPass) {
      throw new BadRequestException(
        'Email or password not correct, Or you choosed another login method like google!',
      );
    }

    const payload = { sub: client.id, email: client.email };

    return {
      client,
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      }),
    };
  }

  async loginAdmin(loginAdminDto: LoginAdminDto) {
    const admin = await this.adminService.findOneByEmail(loginAdminDto.email);

    if (!admin) {
      throw new NotFoundException('Email not found!');
    }

    const validPass = await bcrypt.compare(
      loginAdminDto.password,
      admin.password,
    );

    if (!validPass) {
      throw new BadRequestException('Email or password not correct!');
    }

    const payload = { sub: admin.id, email: admin.email, isAdmin: true };

    return {
      admin,
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
      }),
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const decoded = await this.jwtService.verifyAsync(refreshToken);

      const foundUser = await this.clientService.findOneByEmail(decoded.email);

      if (foundUser) {
        const payload = {
          sub: decoded.id,
          email: decoded.email,
          isAdmin: false,
        };

        return {
          accessToken: await this.jwtService.signAsync(payload),
        };
      }

      const foundAdmin = await this.adminService.findOneByEmail(decoded.email);

      if (foundAdmin) {
        const payload = {
          sub: decoded.id,
          email: decoded.email,
          isAdmin: true,
        };

        return {
          accessToken: await this.jwtService.signAsync(payload),
        };
      }

      throw new UnauthorizedException();
    } catch (error) {
      throw new ForbiddenException('Invalid refresh token');
    }
  }

  async forgetPassword(email: string): Promise<void> {
    // 1. Find the user (client or admin) by email
    const foundUser = await this.findUserByEmail(email);

    // 2. Throw error if user not found
    if (!foundUser) {
      throw new NotFoundException(`Email: ${email} not found!`);
    }

    // 3. Generate a random string for verification
    const randomStr = Math.floor(100000 + Math.random() * 900000).toString();

    // 4. Create JWT token with user information
    const token = await this.createJwtToken(foundUser, randomStr);

    // 5. Update user's verification token (client or admin)
    await this.updateUserVerifyToken(foundUser, token);

    // 6. Send password reset email with token
    this.sendMail(
      'We have received a password reset request. Please use the below link to rest your password?',
      foundUser.email,
      token,
    );
  }

  private async findUserByEmail(email: string): Promise<Client | Admin | null> {
    const admin = await this.adminService.findOneByEmail(email);
    if (admin) {
      return admin;
    }

    const client = await this.clientService.findOneByEmail(email);
    if (client) {
      return client;
    }

    return null;
  }

  private async createJwtToken(
    user: Client | Admin,
    randomStr: string,
  ): Promise<string> {
    return await this.jwtService.signAsync({
      randomStr,
      email: user.email,
      client: user instanceof Client,
    });
  }

  private async updateUserVerifyToken(user: Client | Admin, token: string) {
    user.verifyToken = token;
    if (user instanceof Client) {
      await this.clientService.update(user);
    } else {
      await this.adminService.update(user.id, user);
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const decoded = await this.jwtService.verifyAsync(resetPasswordDto.token);

    // Determine user type based on token
    const user = await this.getUserByEmailAndType(
      decoded.email,
      decoded.client,
    );

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
    await this.updateUserByType(user);
  }

  private async getUserByEmailAndType(
    email: string,
    isClient: boolean,
  ): Promise<Client | Admin> {
    if (isClient) {
      return await this.clientService.findOneByEmail(email);
    } else {
      return await this.adminService.findOneByEmail(email);
    }
  }

  private async updateUserByType(user: Client | Admin): Promise<void> {
    if (user instanceof Client) {
      await this.clientService.update(user);
    } else {
      await this.adminService.update(user.id, user);
    }
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
