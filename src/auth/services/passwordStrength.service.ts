import { Injectable } from '@nestjs/common';
import { PasswordStrengthEnum } from '../types/auth.types';



@Injectable()
export class PasswordStrengthService {
  constructor() {}

  private findCommonPrefix(string1: string, string2: string) {
    const length = Math.min(string1.length, string2.length);
    let commonPrefix = '';
    for (let i = 0; i < length; i++) {
      const char1 = string1[i].toLowerCase();
      const char2 = string2[i].toLowerCase();
      if (char1 !== char2) {
        break;
      }
      commonPrefix += string1[i];
    }
    return commonPrefix;
  }

  private calculateStringSimilarityPercentage(string1: string, string2: string) {
    const length = Math.min(string1.length, string2.length);
    const commonSubstring = this.findCommonPrefix(string1, string2);
    const similarityPercentage = (commonSubstring.length * 100) / length;
    return similarityPercentage;
  }

  strength(password: string, email: string) { 
    let strengthPercentage = 0
    
    let errorMessages: string[] = [];
    
    // Check for password length
    let passwordLength = password.length
    if (passwordLength >= 10) {
      strengthPercentage += 20
    } else if (passwordLength >= 8) {
      strengthPercentage += 10
    } else {
      errorMessages.push("Password must be at least 8 characters long");
    }
    // Check for uppercase letters
    let uppercaseLettersPattern = /[A-Z]/;
    if(uppercaseLettersPattern.test(password)) {
      strengthPercentage += 20
    } else {
      errorMessages.push("Password must contain at least one uppercase letter");
    }

    // Check for lowercase letters
    let lowercaseLettersPattern = /[a-z]/;
    if(lowercaseLettersPattern.test(password)) {
      strengthPercentage += 20
    } else {
      errorMessages.push("Password must contain at least one lowercase letter");
    }

    // Check for numbers
    let numbersPattern = /[0-9]/;
    if(numbersPattern.test(password)) {
      strengthPercentage += 20
    } else {
      errorMessages.push("Password must contain at least one number");
    }
    
    // Check for special characters
    let specialCharactersPattern = /[^A-Za-z0-9]/;
    if(specialCharactersPattern.test(password)) {
      strengthPercentage += 20
    } else {
      errorMessages.push("Password must contain at least one special character");
    }

    // Check for commonly used passwords
    let commonlyUsedPasswords = ["password", "1234567", "123456789", "qwerty", "letmein", "admin"];
    let isCommonPassword = false;
    for(let commonPassword of commonlyUsedPasswords) {
      if(password.includes(commonPassword)) {
        isCommonPassword = true;
      }
    }
    if(isCommonPassword) {
      errorMessages.push("Password is commonly used and not allowed");
    }
    
    // Check for similarity to email
    let emailSimilarityPercentage = this.calculateStringSimilarityPercentage(password, email);
    strengthPercentage -= emailSimilarityPercentage
    
    if(emailSimilarityPercentage > 70) {
      errorMessages.push("Password is too similar to the email");
    }
    
    // Check for consecutive keyboard patterns
    let consecutiveKeyboardPatterns = [
        "qwerty", "asdf", "zxcv", "qaz", "wsx", "edc", "rfv", "tgb", "yhn", "ujm",
        "ikl", "cvbn", "123", "456", "6789",
        "qwer", "xcvb", "azs", "qwe", "asd", "zxc", "rty", "fgh", "vbn", "tyu",
        "mnbvc", "nbvcx", "iuyt", "poi", "098", "765", "4321", "jkl", "lo", "lop",
        "cde3","xsw2", "zaq1", "cde", "xsw", "zaq"
    ]
    let hasConsecutiveKeyboardPatterns = false;

    for (let i = 0; i < password.length - 2; i++) {
      const consecutivePattern = password.substring(i, i + 3);
      if (consecutiveKeyboardPatterns.includes(consecutivePattern.toLowerCase())) {
        hasConsecutiveKeyboardPatterns = true;
        break;
      }
    }
    
    if (hasConsecutiveKeyboardPatterns) {
      strengthPercentage -= 20
      errorMessages.push("Password contains consecutive keyboard patterns");
    }
    
    // Check for consecutive numbers
    let consecutiveNumbersPattern = "01234567890";
    if (password.includes(consecutiveNumbersPattern)) {
      strengthPercentage -= 30;
      errorMessages.push("Password contains consecutive numbers");
    }

    // Check for repeating patterns
    let repeatingPatterns = [
      "abab", "123123", "xyzxyz",
      "qwqw", "abacabac", "xyxy", "112211", "zxyzxyz", "987987", "abcdabcd",
      "pqpq", "xyabxyab", "789789", "efghefgh", "mnmnmn", "000111", "qweqwe"
    ]
    var hasRepeatingPatterns = false;

    for (let i = 0; i < repeatingPatterns.length; i++) {
      if (password.toLowerCase().includes(repeatingPatterns[i])) {
        hasRepeatingPatterns = true;
        break;
      }
    }

    if (hasRepeatingPatterns) {
      strengthPercentage -= 10
      errorMessages.push("Password contains repeating patterns");
    }
      
    // Check for sequential characters
    let sequentialCharactersPatterns = ["abc", "def", "123", "xyz"]
    var hasSequentialCharacters = false;

    for (let i = 0; i < sequentialCharactersPatterns.length; i++) {
      if (password.toLowerCase().includes(sequentialCharactersPatterns[i])) {
        hasSequentialCharacters = true;
        break;
      }
    }
    
    if (hasSequentialCharacters) {
      strengthPercentage -= 10;
    }
    
    let strength: PasswordStrengthEnum;
    switch (true) {
      case strengthPercentage < 20:
        strength = PasswordStrengthEnum.veryWeak;
        break;
      case strengthPercentage >= 20 && strengthPercentage < 40:
        strength = PasswordStrengthEnum.weak;
        break;
      case strengthPercentage >= 40 && strengthPercentage < 60:
        strength = PasswordStrengthEnum.moderate;
        break;
      case strengthPercentage >= 60 && strengthPercentage < 80:
        strength = PasswordStrengthEnum.strong;
        break;
      default:
        strength = PasswordStrengthEnum.veryStrong;
    }
    // Return the strength percentage (clamp the value between 0 and 100)
    return {percentage: Math.min(strengthPercentage, 100), strength: strength, errorMessages: errorMessages};
  }
}