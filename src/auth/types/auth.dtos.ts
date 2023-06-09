import { IsEmail, IsString, IsNotEmpty, IsNumber, IsNotEmptyObject, IsObject, Length, MinLength, MaxLength, IsOptional, IsEmpty, Max, IsBoolean, isString } from 'class-validator';
import { GenderEnum, UserInterface } from './auth.types';
import { Type } from 'class-transformer';

export class EmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class SignupDto extends EmailDto implements Pick<UserInterface, 'userName' | 'password' | 'referalCode'> {
  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsOptional()
  referalCode: string;
}

export class EmailCodeDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(4)
  code: string;
}

export class PersonalInformationDto implements Pick<UserInterface, 'avatar' | 'fullName' | 'phoneNumber' | 'dateOfBirth' | 'gender'> {
  @IsNumber()
  @IsNotEmpty()
  avatar: number;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsNumber()
  @IsNotEmpty()
  dateOfBirth: number;

  @IsString()
  @IsNotEmpty()
  gender: GenderEnum;
}

export class LangAndColorDto implements Pick<UserInterface, 'language' | 'colorScheme' | 'fun' | 'plus18'> {
  @IsString()
  @IsNotEmpty()
  language: string;

  @IsString()
  @IsNotEmpty()
  colorScheme: string;

  @IsBoolean()
  @IsNotEmpty()
  fun: boolean;

  @IsBoolean()
  @IsNotEmpty()
  plus18: boolean;
}

export class EmailOrUserNameDto {
  @IsString()
  @IsNotEmpty()
  emailOrUserName: string;
}

export class EmailOrUserNamePasswordDto extends EmailOrUserNameDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsBoolean()
  @IsOptional()
  panel: boolean;
}

export class GoogleAuthRedirectDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  scope: string;

  @IsString()
  @IsNotEmpty()
  authuser: string;

  @IsString()
  @IsNotEmpty()
  prompt: string;
}

export class AppleAuthRedirectAuthorizationDto {
  @IsString()
  @IsNotEmpty()
  code: string;

  @IsString()
  @IsNotEmpty()
  id_token: string;

  @IsString()
  @IsNotEmpty()
  state: string;
}

export class AppleAuthRedirectUserDto extends EmailDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class AppleAuthRedirectDto {
  @IsObject()
  @IsNotEmptyObject()
  @Type(() => AppleAuthRedirectAuthorizationDto)
  authorization: AppleAuthRedirectAuthorizationDto;

  @Type(() => AppleAuthRedirectUserDto)
  user: AppleAuthRedirectUserDto;
}

export class ForgetPasswordResetDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  passwordRepeat: string;
}