import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { config } from 'src/shared/config';
import axios from 'axios';
import { FaceBookUserInterface } from '../types/auth.types';
 
@Injectable()
export class FacebookAuthService {
  constructor() {}

  stringifiedParams = `?client_id=${config.FACEBOOK_CLIENT_ID}&redirect_uri=${config.FACEBOOK_REDIRECT_URL}&
  scope=${['email', 'user_friends'].join(',')}&response_type=code&auth_type=rerequest&display=popup`;

  facebookLoginUrl = `https://www.facebook.com/v4.0/dialog/oauth?${this.stringifiedParams}`;

  oauth2Client = new google.auth.OAuth2(
    config.GOOGLE_CLIENT_ID,
    config.GOOGLE_CLIENT_SECRET,
    config.GOOGLE_REDIRECT_URL,
  );

  getFacebookAuthURL() {
    return this.facebookLoginUrl;
  }

  async getAccessTokenFromCode(code: string) {
    let { data }: {data: {access_token: string, token_type: string, expires_in: string}} = await axios({
      url: 'https://graph.facebook.com/v4.0/oauth/access_token',
      method: 'get',
      params: {
        client_id: config.FACEBOOK_CLIENT_ID,
        client_secret: config.FACEBOOK_CLIENT_SECRET,
        redirect_uri: config.FACEBOOK_REDIRECT_URL,
        code,
      },
    });
    return data.access_token;
  };

  async getFacebookUser(code: string) {  
    const accessToken = await this.getAccessTokenFromCode(code);

    const { data }: {data: FaceBookUserInterface} = await axios({
      url: 'https://graph.facebook.com/me',
      method: 'get',
      params: {
        fields: ['id', 'email', 'first_name', 'last_name'].join(','),
        access_token: accessToken,
      },
    });
    return data;
  }
}