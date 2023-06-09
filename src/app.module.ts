import { PasswordStrengthService } from './auth/services/passwordStrength.service';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './shared/app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { config } from './shared/config';
import { RolesGuard } from './shared/roles.guard';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from './shared/mail.service';
import { TicketCartService } from './shared/ticket-cart.service';
import { InitService } from './shared/init.service';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthService } from './auth/services/auth.service';
import { MulterModule } from '@nestjs/platform-express';
import { temporaryImagesPath, userImagesPath } from './shared/paths';
import { GoogleAuthService } from './auth/services/googleAuth.service';
import { AppleAuthService } from './auth/services/appleAuth.service';
import { FacebookAuthService } from './auth/services/facebookAuth.service';
import { RateLimiterEmailMiddleware } from './shared/rate-limiter.middleware';
import { UserNameValidateService } from './auth/services/userNameValidate.service';
import { GetOsService } from './auth/services/getOS.service';
import { ConvertEmailService } from './auth/services/convertEmail.service';
import { Sessions, SessionsSchema } from './schemas/session.schema';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRoot(config.MONGODB_URI),
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}]),
    MongooseModule.forFeature([{name: Sessions.name, schema: SessionsSchema}]),
    ThrottlerModule.forRoot({ttl: 60, limit: 10}),
    MulterModule.register({
      dest: temporaryImagesPath, 
    }),
    MailerModule.forRoot({
      // transport: 'smtps://user@example.com:topsecret@smtp.example.com',
      transport: {
        host: 'smtp.example.com',
        secure: false,
        auth: {
          user: 'user@example.com',
          pass: 'topsecret',
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
      template: {
        dir: join(__dirname, 'email-templates'),
        adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
    InitService,
    {
      provide: 'APP_GUARD',
      useClass: RolesGuard
    },
    {
      provide: 'APP_GUARD',
      useClass: ThrottlerGuard
    },
    MailService,
    TicketCartService,

    AuthService,
    GoogleAuthService,
    AppleAuthService,
    FacebookAuthService,
    GetOsService,
    ConvertEmailService,

    PasswordStrengthService,
    UserNameValidateService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // 2 minutes
    // consumer
    //   .apply(RateLimiterEmailMiddleware('body', 60 * 60 * 12, 2))
    //   .forRoutes('/auth/login');
    consumer
      .apply(RateLimiterEmailMiddleware('session', 60 * 2, 10))
      .forRoutes('/auth/signup/verify', '/auth/login/verify', '/auth/reset-password/verify', '/auth/reset-2fa/verify', '/auth/2fa/verify');
    // 12 hours
    // consumer
    //   .apply(RateLimiterEmailMiddleware('body', 60 * 60 * 12, 20))
    //   .forRoutes('/auth/login');
    // consumer
    //   .apply(RateLimiterEmailMiddleware('session', 60 * 60 * 12, 20))
    //   .forRoutes('/auth/login');
    // 1 hour
    consumer
      .apply(RateLimiterEmailMiddleware('body', 60 * 60 * 1, 10))
      .forRoutes('/auth/login/user');
    consumer
      .apply(RateLimiterEmailMiddleware('session', 60 * 60 * 1, 3))
      .forRoutes('/auth/signup/resend-email', '/auth/2fa/resend-email', '/auth/login/resend-email', '/auth/reset-password/resend-email', '/auth/reset-2fa/resend-email', );
  }
}
