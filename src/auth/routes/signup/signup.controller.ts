import { Controller, Post, Body, Session, Res, UseGuards, Req } from '@nestjs/common';
import { SignupDto, EmailCodeDto } from 'src/auth/types/auth.dtos';
import { Request, Response } from 'express';
import { SessionInterface } from 'src/auth/types/auth.types';
import { NotSignedGuard } from 'src/shared/notSIgned.guard';
import { EmailExistsGuard } from 'src/shared/emailExists.guard';
import { SignupUserService } from './services/signupUser.service';
import { SignupResendEmailService } from './services/signupResend.service';
import { SignupVerifyService } from './services/signupVerify.service';

@Controller('auth/signup')
export class SignupController {
  constructor(
    private readonly signupUserService: SignupUserService,
    private readonly signupResendEmailService: SignupResendEmailService,
    private readonly signupVerifyService: SignupVerifyService,
  ) {}


  @Post('user')
  @UseGuards(NotSignedGuard)
  async signupUser(@Res({passthrough: true}) res: Response, @Body() body: SignupDto, @Session() session: Partial<SessionInterface>) {
    return await this.signupUserService.signupUser(res, body, session);
  }
  
  @Post('resend-email')
  @UseGuards(EmailExistsGuard, NotSignedGuard)
  async signupResendEmail(@Res({passthrough: true}) res: Response, @Session() session: Partial<SessionInterface>) {
    return await this.signupResendEmailService.signupResendEmail(res, session);
  }

  @Post('verify')
  @UseGuards(EmailExistsGuard, NotSignedGuard)
  async signupVerify(@Req() req: Request, @Res({passthrough: true}) res: Response, @Body() body: EmailCodeDto, @Session() session: Partial<SessionInterface>) {
    return await this.signupVerifyService.signupVerify(req, res, body, session);
  }
}