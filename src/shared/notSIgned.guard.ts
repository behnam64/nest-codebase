import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SessionInterface } from 'src/auth/types/auth.types';

@Injectable()
export class NotSignedGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const { session }: {session: SessionInterface} = context.switchToHttp().getRequest();
    return !session.userRole;
  }
}