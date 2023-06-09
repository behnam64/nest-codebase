import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { config } from 'src/shared/config';
import axios from 'axios';



@Injectable()
export class GoogleAuthService {
  constructor() {}

  oauth2Client = new google.auth.OAuth2(
    config.GOOGLE_CLIENT_ID,
    config.GOOGLE_CLIENT_SECRET,
    config.GOOGLE_REDIRECT_URL,
  );

  getGoogleAuthURL() {
    const scopes = [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ];

    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: scopes, // If you only need one scope you can pass it as string
    });
  }

  async getGoogleUser(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
  
    // Fetch the user's profile with the access token and bearer
    const googleUser = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`,
      {
        headers: {
          Authorization: `Bearer ${tokens.id_token}`,
        },
      },
    )
    return googleUser.data;
  } 
}