import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { SessionInterface, SignupPlatformEnum, UserRoleEnum } from 'src/auth/types/auth.types';
import { EmailCodeDto } from '../../../types/auth.dtos';
import { Response, Request } from 'express';
import { AuthService } from '../../../services/auth.service';
import * as moment from 'moment';
import { GetOsService } from 'src/auth/services/getOS.service';
import { AppService } from 'src/shared/app.service';

@Injectable()
export class SignupVerifyService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    private readonly authService: AuthService,
    private readonly getOsService: GetOsService,
    private readonly appService: AppService,
  ) {}

  private async verify(req: Request, res: Response, session: Partial<SessionInterface>, user: UserDocument) {
    if(!user) return;
    user.emailVerified = true;
    user.signupOsBrowser = this.getOsService.getOS(req);
    user.signupPlatform = SignupPlatformEnum.Website;
    await user.save();
    session.userRole = UserRoleEnum.User;
    this.appService.sendResponse(HttpStatus.CREATED, HttpStatus.CREATED, res, 'verified', {data: await this.UserModel.findOne({email: user.email}, this.authService.userFrontProjectionString).lean()});
  }

  async signupVerify(req: Request, res: Response, body: EmailCodeDto, session: Partial<SessionInterface>) {
    const user = await this.UserModel.findOne({email: session.email});
    if(user) {
      if(!user.emailVerified) {
        if(user.emailVerificationExpireDate && user.emailVerificationExpireDate > moment().unix()) {
          if(user.emailVerificationCode === body.code) {
            return await this.verify(req, res, session, user);
          } else {
            await this.authService.emailVerificationCodeWrong(res, 4);
            return false;
          }
        } else {
          this.authService.emailVerificationCodeExpired(res, 3);
        }
      } else {
        return this.appService.sendResponse(HttpStatus.BAD_REQUEST, 2, res, 'email is verified');
      }
    } else {
      return this.authService.userDoesNotExist(res, 1);
    }
  }
}
