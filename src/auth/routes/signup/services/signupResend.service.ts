import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { SessionInterface } from 'src/auth/types/auth.types';
import { Response } from 'express';
import { AuthService } from '../../../services/auth.service';
import { AppService } from 'src/shared/app.service';

@Injectable()
export class SignupResendEmailService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    private readonly authService: AuthService,
    private readonly appService: AppService,
  ) {}

  async signupResendEmail(res: Response, session: Partial<SessionInterface>) {
    const user = await this.UserModel.findOne({email: session.email});
    if(user) {
      if(!user.emailVerified) {
        await this.authService.emailVerificationCodeResend(res, user);
      } else {
        return this.appService.sendResponse(HttpStatus.BAD_REQUEST, 2, res, 'email is verified');
      }
    } else {
      return this.authService.userDoesNotExist(res, 1);
    }
  }
}
