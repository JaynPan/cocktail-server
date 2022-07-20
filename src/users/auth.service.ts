import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(email: string, password: string) {
    const users = await this.userService.find(email);

    if (users.length) {
      throw new BadRequestException('email in use');
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const user = await this.userService.create(email, hashPassword);

    return user;
  }

  async appleSignup(email: string) {
    const users = await this.userService.find(email);

    if (users.length) {
      throw new BadRequestException('email in use');
    }

    const user = await this.userService.createOAuthUser(email);
    const accessToken = await this.jwtService.signAsync({ user });
    return { ...user, accessToken };
  }

  async signIn(email: string, password: string) {
    const [user] = await this.userService.find(email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      throw new BadRequestException('bad password');
    }

    const accessToken = await this.jwtService.signAsync({ user });
    return { ...user, accessToken };
  }
}
