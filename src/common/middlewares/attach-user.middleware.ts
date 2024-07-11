import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { jwtConstants } from 'src/shared/utils/constants';

@Injectable()
export class AttachUserMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (token) {
      try {
        const decoded = await this.jwtService.verifyAsync(token, {
          secret: jwtConstants.secret,
        });
        req['user'] = decoded;
      } catch (err) {
        req['user'] = null;
      }
    } else {
      req['user'] = null;
    }

    next();
  }
}
