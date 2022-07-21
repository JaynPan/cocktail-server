import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

import { GoogleUserInfoDto } from '../dtos/googleOAuth.dto';

@Injectable()
export class GoogleOAuthGuard implements CanActivate {
  private readonly isInProd: boolean;

  constructor(private readonly configService: ConfigService) {
    this.isInProd = configService.get<string>('NODE_ENV') === 'production';
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken: string = request.body.accessToken;

    try {
      const { data: userInfo } = await axios({
        url: 'https://www.googleapis.com/userinfo/v2/me',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      request.body = {
        ...request.body,
        ...(userInfo as GoogleUserInfoDto),
      };
      return true;
    } catch (err) {
      return false;
    }
  }
}
