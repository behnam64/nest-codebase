export enum AccountStatusEnum {

}

export enum SignupPlatformEnum {
  Website = 'Website',
  Google = 'Google',
  Facebook = 'Facebook',
  Apple = 'Apple',
}

export enum UserRoleEnum {
  User = 'user',
  Admin = 'admin'
}

export enum GenderEnum {
  Male = 'male',
  Female = 'female'
}

export interface UserInterface {
  _id: string,

  userName: string,

  fullName: string,

  avatar: number,

  email: string,

  emailVerified: boolean,

  emailVerificationCode: string,

  emailVerificationExpireDate: number | null,
  
  password: string,
  
  dateOfBirth: number,
  
  gender: GenderEnum,
    
  image: string,
    
  phoneNumber: string,
    
  phoneNumberVerified: boolean,
    
  referalCodeUser: string,

  referalCode: string,
    
  accountStatus: AccountStatusEnum,

  userRole: UserRoleEnum,
      
  signupOsBrowser: string,

  language: string,

  colorScheme: string,

  fun: boolean,

  plus18: boolean,

  signupPlatform: SignupPlatformEnum,
      
  signinDate: number,

}

export enum UserEnum {
  _id = '_id',

  userName = 'userName',

  fullName = 'fullName',

  avatar = 'avatar',

  email = 'email',

  emailVerified = 'emailVerified',
  
  emailVerificationCode = 'emailVerificationCode',

  emailVerificationExpireDate = 'emailVerificationExpireDate',
  
  password = 'password',
  
  dateOfBirth = 'dateOfBirth',
  
  gender = 'gender',
    
  image = 'image',
    
  phoneNumber = 'phoneNumber',
    
  phoneNumberVerified = 'phoneNumberVerified',
    
  referalCodeUser = 'referalCodeUser',

  referalCode = 'referalCode',
    
  accountStatus = 'accountStatus',

  userRole = 'userRole',
      
  signupOsBrowser = 'signupOsBrowser',
      
  language = 'language',
      
  colorScheme = 'colorScheme',
      
  fun = 'fun',
      
  plus18 = 'plus18',
      
  signupPlatform = 'signupPlatform',
      
  signinDate = 'signinDate',
}

export interface CookieInterface {
  path: string,
  _expires: number,
  originalMaxAge: number,
  httpOnly: boolean,
  secure: boolean,
  domain: string,
  sameSite: string
}

export interface SessionInterface {
  email: string,
  userRole: UserRoleEnum,
  panel: boolean,
  allowChangePassword: number,
  cookie: CookieInterface
}

export interface CookieSchemaInterface {
  originalMaxAge: number,
  expires: Date,
  secure: null | string,
  httpOnly: boolean,
  domain: null | string,
  path: string,
  sameSite: null | string
}

export interface SessionSchemaInterface {
  email: string,
  userRole: UserRoleEnum,
  panel: boolean,
  allowChangePassword: number
  cookie: CookieSchemaInterface
}

export interface GoogleUserInterface {
  id: string,
  email: string,
  verified_email: boolean,
  name: string,
  given_name: string,
  family_name: string,
  picture: string,
  locale: string,
}

export interface AppleUserInterface {
  sub: string,
  email: string,
}

export interface AppleAuthConfig {
  client_id: string,
  team_id: string,
  key_id: string,
  redirect_uri: string,
  scope: string
}

export interface AppleAuthClient {
  loginURL: () => string;
  accessToken: (grantCode: string) => Promise<any>,
  refreshToken: (refreshToken: string) => Promise<any>
}

export interface FaceBookUserInterface {
  id: string,
  email: string,
  first_name: boolean,
  last_name: string,
}

export enum PasswordStrengthEnum {
  veryWeak = 'Very Weak',
  weak = 'Weak',
  moderate = 'Moderate',
  strong = 'Strong',
  veryStrong = 'Very Strong',
}