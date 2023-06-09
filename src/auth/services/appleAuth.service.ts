import { Injectable } from '@nestjs/common';
const AppleAuth = require('apple-auth');
import { config } from 'src/shared/config';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileFolderPath } from 'src/shared/paths';
import { AppleAuthConfig } from 'apple-auth';
import { AppleAuthClient, AppleUserInterface } from '../types/auth.types';
import { AppleAuthRedirectDto } from '../types/auth.dtos';



@Injectable()
export class AppleAuthService {
  constructor() {
    this.init().then(() => {}).catch(() => {});
    setTimeout(() => {
      this.getAppleAuthURL().then(() => {}).catch(() => {});
    }, 1000)
  }

  oauth2Client: AppleAuthClient;

  appleAuthConfig: AppleAuthConfig = {
    client_id: config.APPLE_CLIENT_ID,
    team_id: config.APPLE_TEAM_ID,
    key_id: config.APPLE_KEY_ID,
    redirect_uri: config.APPLE_REDIRECT_URL,
    scope: 'name email'
  }

  async init() {
    let keyFile = (await fs.readFile(path.join(fileFolderPath, 'AuthKey.p8'))).toString();
    this.oauth2Client = new AppleAuth(this.appleAuthConfig, keyFile, 'text');
  }

  async getAppleAuthURL() {
    return this.oauth2Client.loginURL();
  }

  async getAppleUser(body: AppleAuthRedirectDto) {
    const token = await this.oauth2Client.accessToken(body.authorization.code);
    const appleUser = jwt.decode(token.id_token) as AppleUserInterface;
    return appleUser;
  }
}