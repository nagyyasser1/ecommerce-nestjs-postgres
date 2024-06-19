import { Strategy } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientsService } from 'src/modules/clients/clients.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly clientsService: ClientsService,
    private readonly jwtService: JwtService,
  ) {
    super({
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      passReqToCallback: true,
      scope: ['profile', 'email'],
    });
  }

  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ): Promise<any> {
    try {
      const {
        name,
        email,
        picture,
        email_verified,
        given_name: fname,
        family_name: lname,
      } = profile._json;

      let client = await this.clientsService.findOneByEmail(email);

      if (!client) {
        // create new client
        client = await this.clientsService.create({
          fname,
          lname,
          email,
          deviceToken: '',
          password: this.generateRandomPassword(6),
          verified: email_verified,
        });
      }

      return done(null, client);
    } catch (error) {
      console.error('Error during user validation:', error);
      return done(error, false);
    }
  }

  generateRandomPassword(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
