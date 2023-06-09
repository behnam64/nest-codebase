import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserInterface } from 'src/auth/types/auth.types';
import { config } from './config';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: Pick<UserInterface, 'email' | 'fullName'>, code: string) {
    if(!config.SITE_MAIL) return;
    await this.mailerService.sendMail({
      to: user.email,
      from: `"Support Team" <${config.SITE_MAIL}>`, // override default from
      subject: 'Welcome to Timber Confirm your Email',
      template: './email-confirmation', // `.hbs` extension is appended automatically
      context: { // ✏️ filling curly brackets with content
        fullName: user.fullName,
        code,
      },
    });
  }
}