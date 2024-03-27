// import { Strategy } from 'passport-google-oauth20';
// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { UsersService } from '../../users/users.service';
// import { JwtService } from '@nestjs/jwt';

// @Injectable()
// export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
//   constructor(
//     private readonly configService: ConfigService,
//     private readonly usersService: UsersService,
//     private readonly jwtService: JwtService,
//   ) {
//     super({
//       clientID: configService.get('GOOGLE_CLIENT_ID'),
//       clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
//       callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
//       passReqToCallback: true,
//       scope: ['profile', 'email'],
//     });
//   }

//   async validate(
//     request: any,
//     accessToken: string,
//     refreshToken: string,
//     profile: any,
//     done: any,
//   ): Promise<any> {
//     try {
//       const { name, email, picture } = profile._json;

//       const user = await this.usersService.findOrCreateUserByEmail({
//         name,
//         email,
//         picture,
//         password: email,
//       });

//       delete user.password;

//       // Create JWT token
//       const token = this.jwtService.sign({ sub: user.id, email: user.email });

//       // Include the token in the response

//       return done(null, { user, token });
//     } catch (error) {
//       console.error('Error during user validation:', error);
//       return done(error, false);
//     }
//   }
// }
