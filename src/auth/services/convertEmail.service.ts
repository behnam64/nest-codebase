import { Injectable } from '@nestjs/common';

@Injectable()
export class ConvertEmailService {
  constructor() {}

  convertEmail(email: string): string {
    const parts = email.split('@');
    
    const username = parts[0];
    const domain = parts[1];
    
    if (!username || !domain) {
      return email;
    }
    
    let convertedUsername = '';
    if (username.length > 0) {
      convertedUsername += username[0];
      convertedUsername += '*'.repeat(2);
    }
    
    let convertedDomain = '';
    
    const domainComponents = domain.split('.');
    if (domainComponents.length >= 2) {
      const domainName = domainComponents[0];
      const extensionPart = domainComponents[1];
      
      if (domainName.length > 0) {
        convertedDomain += domainName[0];
        convertedDomain += '*'.repeat(1);
      }
      
      if (extensionPart.length > 0) {
        convertedDomain += '.';
        convertedDomain += extensionPart[0];
        convertedDomain += '*'.repeat(1);
      }
    }
    
    return convertedUsername + '@' + convertedDomain;
  }
}