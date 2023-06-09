import { HttpStatus, Injectable } from '@nestjs/common';
import { Response } from 'express';
import * as moment from 'moment';

@Injectable()
export class AppService {
  sendResponse(statusCode: HttpStatus, status: number, res: Response, messages: string[] | string, extraData?: object) {
    if(Array.isArray(messages)) {
      let data: any = {
        statusCode: statusCode,
        messages: messages
      }
      if(extraData) data = {...data, ...extraData};
      res.status(statusCode).send(data);
    } else {
      let data: any = {
        statusCode: status,
        message: [messages],
        timestamp: moment().unix()
      }
      if(extraData) data = {...data, ...extraData};
      res.status(statusCode).send(data);
    }
  }
}
