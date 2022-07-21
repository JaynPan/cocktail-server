import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AppleOAuthDto } from './dtos/appleOAuth.dto';
import { GoogleOAuthDto } from './dtos/googleOAuth.dto';

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

  async appleSignup(appleDto: AppleOAuthDto) {
    const { email, name } = appleDto;
    const users = await this.userService.find(email);

    if (users.length) {
      throw new BadRequestException('email in use');
    }

    const user = await this.userService.createOAuthUser(email, name);
    const accessToken = await this.jwtService.signAsync({ user });
    return { ...user, accessToken };
  }

  async appleLogin(appleDto: AppleOAuthDto) {
    const { email, name } = appleDto;
    let [user] = await this.userService.find(email);

    if (!user) {
      // In apple OAuth process, the email and name only populate once
      // there is a chance that the details info isn't shown but user is actually first time login.
      user = await this.userService.createOAuthUser(email, name);
    }

    const accessToken = await this.jwtService.signAsync({ user });
    return { ...user, accessToken };
  }

  async googleLogin(googleDto: GoogleOAuthDto) {
    const { email, name } = googleDto;
    let [user] = await this.userService.find(email);

    if (!user) {
      user = await this.userService.createOAuthUser(email, name);
    }

    const accessToken = await this.jwtService.signAsync({ user });
    return { ...user, accessToken };
  }

  async login(email: string, password: string) {
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
