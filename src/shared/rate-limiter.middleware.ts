import { NestMiddleware, mixin } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import { Session } from 'express-session';
import { SessionInterface, UserInterface } from 'src/auth/types/auth.types';
import { config } from './config';

export const RateLimiterEmailMiddleware = (type: 'body' | 'session', seconds: number, max: number) => {
  const limiter = rateLimit({
    windowMs: seconds * 1000, // 1 hour in milliseconds
    max: max, // Maximum number of requests allowed within the window
    store: new (require('rate-limit-mongo'))({
      uri: config.MONGODB_URI,
      collectionName: 'rateLimit',
      resetExpiryOnChange: true,
    }),
    keyGenerator: (req: Request) => {
      if(type === 'session') {
        const session = req.session as Session & SessionInterface;
        return session.email;
      } else {
        const body = req.body as {email: 'string'};
        return body.email;
      }
    }, // Unique identifier for the user
    handler: (req: Request, res: Response, next: NextFunction) => {
      throw new ThrottlerException();
    },
  });
  class RateLimiterEmailMiddlewareMixin implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
      if(type === 'session') {
        const session = req.session as Session & Partial<SessionInterface>;
        const email = session.email;
        if(email) {
          limiter(req, res, next);
        } else {
          next();
        }
      } else {
        const body = req.body as Pick<UserInterface, 'email'>;
        if(body.email) {
          limiter(req, res, next);
        } else {
          next();
        }
        return body.email;
      }
    }
  }

  const middleware = mixin(RateLimiterEmailMiddlewareMixin);
  return middleware;
}
