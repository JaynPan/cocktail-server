import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

// FYI: https://docs.nestjs.com/security/authentication#implementing-passport-jwt
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  // Passport will build a user object based on the return value of our validate() method, and attach it as a property on the Request object.
  async validate(payload: any) {
    return { ...payload.user };
  }
}
