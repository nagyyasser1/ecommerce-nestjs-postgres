import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminsModule } from 'src/admins/admins.module';
import { ClientsModule } from 'src/clients/clients.module';
import { ClientsService } from 'src/clients/clients.service';
import { AdminsService } from 'src/admins/admins.service';

@Module({
  imports: [AdminsModule, ClientsModule],
  controllers: [AuthController],
  providers: [AuthService, ClientsService, AdminsService],
})
export class AuthModule {}
