import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/user.schema';
import { PasswordStrengthEnum, SessionInterface, UserRoleEnum } from 'src/auth/types/auth.types';
import { config } from 'src/shared/config';
import { SignupDto } from '../../../types/auth.dtos';
import { Response } from 'express';
import { AuthService } from '../../../services/auth.service';
import * as bcrypt from 'bcrypt';
import { PasswordStrengthService } from 'src/auth/services/passwordStrength.service';
import { UserNameValidateService } from 'src/auth/services/userNameValidate.service';
import * as moment from 'moment';
import { AppService } from 'src/shared/app.service';

@Injectable()
export class SignupUserService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    private readonly authService: AuthService,
    private readonly passwordStrengthService: PasswordStrengthService,
    private readonly userNameValidateService: UserNameValidateService,
    private readonly appService: AppService,
  ) {}

  private async makeUser(type: 'create' | 'update', res: Response, body: SignupDto, session: Partial<SessionInterface>) {
    let referalCodeUser;
    while(true) {
      referalCodeUser = this.authService.makeReferalCode();
      const user = await this.UserModel.findOne({referalCodeUser: referalCodeUser}).lean();
      if(!user) break;
    }
    let referalCode;
    const userReferalCode = await this.UserModel.findOne({referalCode: body.referalCode}).lean();
    referalCode = userReferalCode?.referalCode ? userReferalCode.referalCode : '';
    const code = this.authService.makeCode();
    let user: User | null = null;
    if(type === 'create') {
      user = await this.UserModel.create({email: body.email, userName: body.userName, password: body.password, userRole: UserRoleEnum.User, referalCode: referalCode, referalCodeUser: referalCodeUser, emailVerificationCode: code, emailVerificationExpireDate: moment().add(2, 'minutes').unix(), signinDate: moment().unix()});
    } else if(type === 'update') {
      user = await this.UserModel.findOneAndUpdate({email: body.email}, {email: body.email, userName: body.userName, password: body.password, userRole: UserRoleEnum.User, referalCode: referalCode, referalCodeUser: referalCodeUser, emailVerificationCode: code, emailVerificationExpireDate: moment().add(2, 'minutes').unix(), signinDate: moment().unix()}).lean();
    }
    session.email = body.email;
    user && this.authService.sendMail(user, code);
    const data: any = {};
    if(!config.SITE_MAIL) data.code = code;
    this.appService.sendResponse(HttpStatus.CREATED, HttpStatus.CREATED, res, 'user created and email verification code sent', data)
  }

  async signupUser(res: Response, body: SignupDto, session: Partial<SessionInterface>) {
    const email = await this.UserModel.findOne({email: body.email}).lean();
    const userName = await this.UserModel.findOne({userName: body.userName}).lean();
    const strength = this.passwordStrengthService.strength(body.password, body.email);
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(body.password, salt);
    body.password = hashedPassword;
    if(this.userNameValidateService.validate(body.userName)) {
      if(strength.strength === PasswordStrengthEnum.strong || strength.strength === PasswordStrengthEnum.veryStrong) {
        if(email) {
          if(!email.emailVerified) {
            if(userName) {
              if(userName.email === email.email) {
                return await this.makeUser('update', res, body, session);
              } else {
                return this.appService.sendResponse(HttpStatus.BAD_REQUEST, 3, res, 'userName exists and is being used');
              }
            } else {
              await this.makeUser('update', res, body, session);
            }
          } else {
            return this.appService.sendResponse(HttpStatus.BAD_REQUEST, 4, res, 'email exists and is verified');
          }
        } else {
          if(userName) {
            return this.appService.sendResponse(HttpStatus.BAD_REQUEST, 3, res, 'userName exists and is being used');
          } else {
            return await this.makeUser('create', res, body, session);
          }
        }
      } else {
        return this.appService.sendResponse(HttpStatus.BAD_REQUEST, 2, res, [`password is ${strength}`, ...strength.errorMessages]);
      } 
    } else {
      return this.appService.sendResponse(HttpStatus.BAD_REQUEST, 1, res, 'username should only contain letters, numbers, and underscores');
    }
  }
}
