import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

// https://docs.nestjs.com/guards#putting-it-all-together
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // In order to access the route's role(s) (custom metadata), we'll use the Reflector helper class
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    // no role restriction
    if (!roles) return true;

    const { user } = context.switchToHttp().getRequest();

    return roles.includes(user.role);
  }
}
