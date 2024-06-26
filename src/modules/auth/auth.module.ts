import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AdminsModule } from 'src/modules/admins/admins.module';
import { ClientsModule } from 'src/modules/clients/clients.module';
import { ClientsService } from 'src/modules/clients/clients.service';
import { AdminsService } from 'src/modules/admins/admins.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './passport/google.strategy';

@Module({
  imports: [
    AdminsModule,
    ClientsModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule.register({ defaultStrategy: 'google' }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ClientsService, AdminsService, GoogleStrategy],
})
export class AuthModule {}
