!process.env.ENV ? process.env.ENV = 'development' : null;
!process.env.MONGODB_URI ? process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/timber' : null;
!process.env.SITE_MAIL ? process.env.SITE_MAIL = '' : null;

!process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID = '949512671496-jfgg5kufn56jpgenc24kqk9ufhvh28eo.apps.googleusercontent.com' : null;
!process.env.GOOGLE_CLIENT_SECRET ? process.env.GOOGLE_CLIENT_SECRET = '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' : null;
!process.env.GOOGLE_REDIRECT_URL ? process.env.GOOGLE_REDIRECT_URL = 'http://localhost:3000/auth/login/google-redirect' : null;

!process.env.APPLE_CLIENT_ID ? process.env.APPLE_CLIENT_ID = '949512671496-jfgg5kufn56jpgenc24kqk9ufhvh28eo.apps.googleusercontent.com' : null;
!process.env.APPLE_TEAM_ID ? process.env.APPLE_TEAM_ID = '949512671496-jfgg5kufn56jpgenc24kqk9ufhvh28eo.apps.googleusercontent.com' : null;
!process.env.APPLE_KEY_ID ? process.env.APPLE_KEY_ID = '949512671496-jfgg5kufn56jpgenc24kqk9ufhvh28eo.apps.googleusercontent.com' : null;
!process.env.APPLE_REDIRECT_URL ? process.env.APPLE_REDIRECT_URL = 'http://localhost:3000/auth/login/apple-redirect' : null;

!process.env.FACEBOOK_CLIENT_ID ? process.env.FACEBOOK_CLIENT_ID = '949512671496-jfgg5kufn56jpgenc24kqk9ufhvh28eo.apps.googleusercontent.com' : null;
!process.env.FACEBOOK_CLIENT_SECRET ? process.env.FACEBOOK_CLIENT_SECRET = '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' : null;
!process.env.FACEBOOK_REDIRECT_URL ? process.env.FACEBOOK_REDIRECT_URL = 'http://localhost:3000/auth/login/facebook-redirect' : null;
export const config = {
  ENV: process.env.ENV as 'development' | 'production',
  MONGODB_URI: process.env.MONGODB_URI,
  SITE_MAIL: process.env.SITE_MAIL,

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL: process.env.GOOGLE_REDIRECT_URL,
  
  APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID,
  APPLE_TEAM_ID: process.env.APPLE_TEAM_ID,
  APPLE_KEY_ID: process.env.APPLE_KEY_ID,
  APPLE_REDIRECT_URL: process.env.APPLE_REDIRECT_URL,
  
  FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
  FACEBOOK_REDIRECT_URL: process.env.FACEBOOK_REDIRECT_URL,
}