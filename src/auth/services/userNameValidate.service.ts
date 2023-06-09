import { Injectable } from '@nestjs/common';
import { PasswordStrengthEnum } from '../types/auth.types';



@Injectable()
export class UserNameValidateService {
  constructor() {}

  validate(userName: string): boolean {
    var pattern = /^[a-zA-Z0-9_]+$/;
    return pattern.test(userName);
  }
}