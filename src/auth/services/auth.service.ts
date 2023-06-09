import { HttpStatus, Injectable } from '@nestjs/common';
import { User, UserDocument } from 'src/schemas/user.schema';
import { UserEnum, UserInterface } from 'src/auth/types/auth.types';
import { MailService } from 'src/shared/mail.service';
import * as voucherCode from 'voucher-code-generator';
import { Response } from 'express';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { config } from 'src/shared/config';
import { EmailOrUserNameDto } from '../types/auth.dtos';
import * as classValidator from 'class-validator';
import * as moment from 'moment';
import { AppService } from 'src/shared/app.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly mailService: MailService,
    @InjectModel(User.name) private UserModel: Model<User>,
    private readonly appService: AppService,
  ) {}

  userFrontProjectionString = `${UserEnum.userName} ${UserEnum.fullName} ${UserEnum.avatar} ${UserEnum.email} ${UserEnum.dateOfBirth} ${UserEnum.gender} ${UserEnum.fun} ${UserEnum.plus18} ${UserEnum.image} ${UserEnum.phoneNumber} ${UserEnum.referalCodeUser} ${UserEnum.accountStatus} ${UserEnum.userRole} ${UserEnum.signinDate} ${UserEnum.language} ${UserEnum.colorScheme}`;
  userFrontProjectionObject = {userName: 1, fullName: 1, avatar: 1, email: 1, dateOfBirth: 1, gender: 1, fun: 1, plus18: 1, image: 1, phoneNumber: 1, referalCodeUser: 1, accountStatus: 1, userRole: 1, signinDate: 1, language: 1, colorScheme: 1};
  makeCode = () => voucherCode.generate({length: 4, count: 1, charset: "0123456789"})[0];
  makeReferalCode = () => voucherCode.generate({length: 15, count: 1})[0];
  sendMail = (user: User, code: string) => this.mailService.sendUserConfirmation({email: user?.email, fullName: user?.fullName}, code).then(() => {}).catch(() => {})

  userDoesNotExist(res: Response, status: number) {
    this.appService.sendResponse(HttpStatus.BAD_REQUEST, status, res, 'user does not exist');
  }

  async emailVerificationCodeResend(res: Response, user: UserDocument) {
    if(!user) return;
    const code = this.makeCode();
    user.emailVerificationCode = code;
    user.emailVerificationExpireDate = moment().add(2, 'minutes').unix();
    this.sendMail(user, code);
    await user.save()
    const data: any = {};
    if(!config.SITE_MAIL) data.code = code;
    this.appService.sendResponse(HttpStatus.CREATED, HttpStatus.CREATED, res, 'email verification code resent', data);
  }

  async emailVerificationCodeWrong(res: Response, status: number) {
    this.appService.sendResponse(HttpStatus.BAD_REQUEST, status, res, 'email verification code is wrong');
  }

  async emailVerificationCodeExpired(res: Response, status: number) {
    this.appService.sendResponse(HttpStatus.BAD_REQUEST, status, res, 'email verification code is expired');
  }

  async tokenCodeWrong(res: Response, status: number) {
    this.appService.sendResponse(HttpStatus.BAD_REQUEST, status, res, 'token is wrong or expired');
  }

  parseEmailUserNametoFilter(body: EmailOrUserNameDto): Partial<Pick<UserInterface, 'email' | 'userName'>> {
    const isEmail = classValidator.isEmail(body.emailOrUserName);
    let filter: Partial<Pick<UserInterface, 'email' | 'userName'>>;
    isEmail ? filter = {email: body.emailOrUserName} : filter = {userName: body.emailOrUserName};
    return filter;
  }
}
