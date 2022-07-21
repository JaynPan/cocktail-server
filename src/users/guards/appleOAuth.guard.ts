import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppleStrategy, JwtTokenSchema } from '../strategies/apple.strategy';

@Injectable()
export class AppleOAuthGuard implements CanActivate {
  private readonly isInProd: boolean;

  constructor(
    private readonly configService: ConfigService,
    private readonly apple: AppleStrategy,
  ) {
    this.isInProd = configService.get<string>('NODE_ENV') === 'production';
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token: string = <string>request.body.identityToken;

    if (!token) return false;

    try {
      const jwtSchema: JwtTokenSchema = await this.apple.ValidateTokenAndDecode(
        token,
      );

      request.body = {
        ...request.body,
        email: jwtSchema.email,
        name: request.body.name,
      };

      return true;
    } catch (err) {
      return false;
    }
  }
}
