import { EmailValidatorAdapter } from './email-validator';
import validator from 'validator';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  }
}));

describe('EmailValidator Adapter', () => {
  test('Should return false if email is invalid', () => {
    const sut = new EmailValidatorAdapter();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const isValid = sut.isValid('invalid_emai');
    expect(isValid).toBe(false);
  });
  test('Should return true if email is valid', () => {
    const sut = new EmailValidatorAdapter();
    const isValid = sut.isValid('valid_email@mail.com');
    expect(isValid).toBe(true);
  });
});
