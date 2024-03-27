import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { AdminsService } from 'src/admins/admins.service';
import { ClientsService } from 'src/clients/clients.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly adminService: AdminsService,
    private readonly clientService: ClientsService,
  ) {}

  createClient(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  createAdmin(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  loginClient(createAuthDto: CreateAuthDto) {
    return `This action returns all auth`;
  }

  loginAdmin(createAuthDto: CreateAuthDto) {
    return `This action returns a  auth`;
  }
}
