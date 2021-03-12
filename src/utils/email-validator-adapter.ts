import { EmailValidator } from '../presentation/protocols/email-validator';
import validator from 'validator';

export class EmailValidatorAdapter implements EmailValidator {
  isValid(email: string): boolean {
    const isValidEmail = validator.isEmail(email);
    return isValidEmail;
  }
}
