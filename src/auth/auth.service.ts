import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { AdminsService } from 'src/admins/admins.service';
import { ClientsService } from 'src/clients/clients.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { LoginClientDto } from './dto/login-client.dto';
import { LoginAdminDto } from './dto/login-admin.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminsService,
    private readonly clientService: ClientsService,
    private readonly jwtService: JwtService,
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
      throw new NotFoundException('email not found!');
    }

    const validPass = await bcrypt.compare(
      loginClientDto.password,
      client.password,
    );

    if (!validPass) {
      throw new BadRequestException(
        'email Or password not correct, Or you choosed another login method like google!',
      );
    }

    const payload = { sub: client.id, email: client.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async loginAdmin(loginAdminDto: LoginAdminDto) {
    const admin = await this.adminService.findOneByEmail(loginAdminDto.email);

    if (!admin) {
      throw new NotFoundException('email not found!');
    }

    const validPass = await bcrypt.compare(
      loginAdminDto.password,
      admin.password,
    );

    if (!validPass) {
      throw new BadRequestException('email Or password not correct');
    }

    const payload = { sub: admin.id, email: admin.email, isAdmin: true };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
