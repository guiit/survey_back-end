import { SignupController } from './signup';
import { InvalidParamError, MissingParamError, ServerError } from '../errors';
import { EmailValidator } from '../protocols';
import { AddAccountModel, AddAcount } from '../../domain/usercases/add-account';
import { AccountModel } from '../../domain/models/account';

const makeAddAcountStub = () => {
  class AddAccountStub implements AddAcount {
    add(account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid',
        name: 'valid',
        email: 'valid',
        password: 'valid'
      };
      return fakeAccount;
    }
  }

  return new AddAccountStub();
};

const makeEmailValidationStub = () => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

interface SutTypes {
  sut: SignupController;
  emailValidatorStub: EmailValidator;
  addAccountStub: AddAcount;
}

const makeSut = (): SutTypes => {
  const emailValidatorStub = makeEmailValidationStub();
  const addAccountStub = makeAddAcountStub();
  const sut = new SignupController(emailValidatorStub, addAccountStub);
  return { sut, emailValidatorStub, addAccountStub };
};

describe('Signup Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any@email.com',
        password: '123',
        passwordConfirmation: '123'
      }
    };
    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });
  test('Should return 400 if no email is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        password: '123',
        passwordConfirmation: '123'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });
  test('Should return 400 if no password is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email',
        passwordConfirmation: '123'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });
  test('should return 400 if no passwordConfirmation is provided', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email',
        password: '123'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation')
    );
  });

  test('should return 400 if no passwordConfirmation is different from password', () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@email',
        password: '123',
        passwordConfirmation: 'invalid'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new InvalidParamError('passwordConfirmation')
    );
  });

  test('Should return 400 if the email is invalid', () => {
    const { sut, emailValidatorStub } = makeSut();
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@email',
        password: '123',
        passwordConfirmation: '123'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  test('Should call EmailValidator with a correct email', () => {
    const { sut, emailValidatorStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@email',
        password: '123',
        passwordConfirmation: '123'
      }
    };
    sut.handle(httpRequest);
    expect(isValidSpy).toHaveBeenCalledWith('invalid_email@email');
  });

  test('Should return 500 if EmailValidator throws an exception', () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
      throw new ServerError();
    });

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@email',
        password: '123',
        passwordConfirmation: '123'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test('Should call addAcount', () => {
    const { sut, addAccountStub } = makeSut();

    const addSpy = jest.spyOn(addAccountStub, 'add');

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@email',
        password: '123',
        passwordConfirmation: '123'
      }
    };
    sut.handle(httpRequest);
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'invalid_email@email',
      password: '123'
    });
  });

  test('Should return 500 if addAcount throws an exception', () => {
    const { sut, addAccountStub } = makeSut();

    jest.spyOn(addAccountStub, 'add').mockImplementation(() => {
      throw new ServerError();
    });

    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@email',
        password: '123',
        passwordConfirmation: '123'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(500);
    expect(httpResponse.body).toEqual(new ServerError());
  });

  test('Should return 200 if data provided is correct', () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        id: 'valid',
        name: 'valid',
        email: 'valid',
        password: 'valid',
        passwordConfirmation: 'valid'
      }
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(200);
    expect(httpResponse.body).toEqual({
      id: 'valid',
      name: 'valid',
      email: 'valid',
      password: 'valid'
    });
  });
});
