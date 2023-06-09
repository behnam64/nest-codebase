import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { Cron } from '@nestjs/schedule'; 
import { lottImagesPath, temporaryImagesPath, ticketCartFontFilePath, ticketCartFontPath, ticketCartFontPngFilePath, ticketCartFontPngPath, ticketCartImagePath, ticketCartPath, ticketCartTemplateFilePath, ticketCartTemplatePath, userImagesPath } from './paths';
import * as moment from 'moment';

@Injectable()
export class InitService {
  async init() {
    try {await fs.readdir(ticketCartPath)} catch {await fs.mkdir(ticketCartPath)}
    try {await fs.readdir(ticketCartImagePath)} catch {await fs.mkdir(ticketCartImagePath)}
    try {await fs.readdir(temporaryImagesPath)} catch {await fs.mkdir(temporaryImagesPath)}
    try {await fs.readdir(userImagesPath)} catch {await fs.mkdir(userImagesPath)}
    try {await fs.readdir(lottImagesPath)} catch {await fs.mkdir(lottImagesPath)}
    try {await fs.readFile(ticketCartTemplatePath)} catch {await fs.copyFile(ticketCartTemplateFilePath, ticketCartTemplatePath)}
    try {await fs.readFile(ticketCartFontPath)} catch {await fs.copyFile(ticketCartFontFilePath, ticketCartFontPath)}
    try {await fs.readFile(ticketCartFontPngPath)} catch {await fs.copyFile(ticketCartFontPngFilePath, ticketCartFontPngPath)}
  }

  // @Cron('5,10,15,20,25,30,35,40,45,50 * * * * *')
  // async handleCron() {
  //   try {
  //     console.log('log')
  //     const fileNames = await fs.readdir(ticketCartImagePath);
  //     for(let fileName of fileNames) {
  //       let fileDate = moment.unix(+fileName.split('-')[1].split('.')[0]);
  //       let duration = fileDate.diff(moment(), 'hours');
  //       console.log(duration)
  //       if(duration >= 24) {
  //         await fs.unlink(path.join(ticketCartImagePath, fileName))
  //       }
  //     }
  //   } catch{}
  // }
}
