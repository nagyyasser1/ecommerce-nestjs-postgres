import { Strategy } from 'passport-google-oauth20';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';
import { UserType } from 'src/shared/utils/enums';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
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

      let user = await this.usersService.findOneByEmail(email);

      if (!user) {
        // create new user
        user = await this.usersService.create({
          fname,
          lname,
          email,
          deviceToken: '',
          password: '',
          authType: 'google',
          verified: email_verified,
          phone: '0',
          verifyToken: '',
          userType: UserType.CLIENT,
        });
      }

      return done(null, user);
    } catch (error) {
      console.error('Error during user validation:', error);
      return done(error, false);
    }
  }
}
