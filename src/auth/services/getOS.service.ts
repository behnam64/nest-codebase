import { Injectable } from "@nestjs/common";
import { Request } from "express";
import * as useragent from 'useragent';

@Injectable()
export class GetOsService {
  constructor() {}

  getOS(req: Request) {
    req.headers['user-agent']
    const userAgent = req.headers['user-agent'];

    // Parse the user-agent string to extract the operating system information
    // You can use any library or custom logic here to extract the operating system details

    // Example: using 'useragent' library
    const agent = useragent.parse(userAgent);
    const operatingSystem = agent.toString();

    return operatingSystem;
  }
}