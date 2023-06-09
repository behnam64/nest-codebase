import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
const jimp = require('jimp')
const bwip = require('bwip-js');
import * as moment from 'moment'
import { ticketCartFontPath, ticketCartImagePath, ticketCartTemplatePath } from './paths';

@Injectable()
export class TicketCartService {
  getHello(): string {
    return 'Hello World!';
  }
  constructor() {
    // this.ticketCart('fklghkgjdjfkldjf', {title: 'USA Power Lotto'})
  }

  async ticketCart(barcode: string, data: {title: string}) {
    const now = moment().unix();
    const getRandomTitle = () => `${Math.random()}${Math.random()}-${now}`;
    let temporaryBarcodePath: string;
    let temporaryTicketCartPath: string;
    while(true) {
      temporaryBarcodePath = path.join(ticketCartImagePath, `${getRandomTitle()}.png`);
      try {
        await fs.readFile(temporaryBarcodePath);
        temporaryBarcodePath = path.join(ticketCartImagePath, `${getRandomTitle()}.png`);
      } catch(err) {
        break;
      }
    }
    while(true) {
      temporaryTicketCartPath = path.join(ticketCartImagePath, `${getRandomTitle()}.png`);
      try {
        await fs.readFile(temporaryTicketCartPath);
        temporaryTicketCartPath = path.join(ticketCartImagePath, `${getRandomTitle()}.png`);
      } catch(err) {
        break;
      }
    }
    let loadedImage: any;
    await fs.copyFile(ticketCartTemplatePath, temporaryTicketCartPath);
    loadedImage = await jimp.read(temporaryTicketCartPath);
    const font = await jimp.loadFont(ticketCartFontPath);
    const makeBarcode = (barcode: string) => {
      return new Promise((resolve, reject) => {
        bwip.toBuffer({
          bcid:        'code128',       // Barcode type
          text:        barcode,         // Text to encode
          scaleX:      2,               // 2x scaling factor
          scaleY:      1,               // 1y scaling factor
          includetext: false,           // Show human-readable text
          textxalign:  'center',        // Always good to set this
        }, async function (err:any, png: any) {
          if(err) {
            reject(err);
          } else {
            resolve(png);
          }
        });
      })
    }
    const png: any = await makeBarcode(barcode);
    await fs.writeFile(temporaryBarcodePath, png)
    const image = await jimp.read(temporaryBarcodePath);
    await loadedImage.print(font, 10, 10, data.title).write(temporaryTicketCartPath);
    await loadedImage.composite(image, 10, 100).write(temporaryTicketCartPath);
    setTimeout(async () => {
      try {
        await fs.unlink(temporaryBarcodePath);
      } catch {}
    }, 2000);
  }
}
