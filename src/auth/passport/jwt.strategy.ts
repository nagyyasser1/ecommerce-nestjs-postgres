// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { PassportStrategy } from '@nestjs/passport';
// import { Injectable, UnauthorizedException } from '@nestjs/common';
// import { jwtConstants, userRoles } from 'src/util/constants.util';
// import { AuthService } from '../auth.service';
// import { UsersService } from 'src/users/users.service';
// import { User } from 'src/users/entities/user.entity';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(
//     private readonly authService: AuthService,
//     private readonly usersService: UsersService,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
//       ignoreExpiration: false,
//       secretOrKey: jwtConstants.secret,
//     });
//   }

//   async validate(payload: any) {
//     const user: Promise<User> = this.authService.validateEmail(payload.email);

//     if (!user) {
//       throw new UnauthorizedException();
//     }

//     if ((await user).userType === userRoles.specialist) {
//       return await this.usersService.findOneById((await user).id);
//     }

//     return user;
//   }
// }
