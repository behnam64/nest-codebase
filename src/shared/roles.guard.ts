import { SessionInterface } from './../auth/types/auth.types';
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoleEnum } from 'src/auth/types/auth.types';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoleEnum[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { session }: {session: SessionInterface} = context.switchToHttp().getRequest();
    const passed = requiredRoles.some((role) => session.userRole === role);
    if(passed) {
      return true;
    } else {
      throw new UnauthorizedException();
    }
  }
}