import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { AccountStatusEnum, GenderEnum, SignupPlatformEnum, UserRoleEnum } from 'src/auth/types/auth.types';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({type: String, index: true})
  userName: string;

  @Prop({type: String})
  fullName: string;

  @Prop({type: Number})
  avatar: number;

  @Prop({type: String, index: true})
  email: string;

  @Prop({type: Boolean, default: false})
  emailVerified: boolean;

  @Prop({type: String})
  emailVerificationCode: string;

  @Prop({type: Number})
  emailVerificationExpireDate: number | null;

  @Prop({type: String})
  password: string;
  
  @Prop({type: Number})
  dateOfBirth: number;
  
  @Prop({type: String})
  gender: GenderEnum;
    
  @Prop({type: String})
  image: string;
  
  @Prop({type: String})
  phoneNumber: string;
    
  @Prop({type: Boolean, default: false})
  phoneNumberVerified: boolean;
    
  @Prop({type: String})
  referalCodeUser: string;

  @Prop({type: String})
  referalCode: string;
    
  @Prop({type: String})
  accountStatus: AccountStatusEnum;
      
  @Prop({type: String})
  userRole: UserRoleEnum;

  @Prop({type: String})
  signupOsBrowser: string;

  @Prop({type: String})
  language: string;

  @Prop({type: String})
  colorScheme: string;

  @Prop({type: Boolean, default: false})
  fun: boolean;

  @Prop({type: Boolean, default: false})
  plus18: boolean;
  
  @Prop({type: String})
  signupPlatform: SignupPlatformEnum;
      
  @Prop({type: Number})
  signinDate: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
