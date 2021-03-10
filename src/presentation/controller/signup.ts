import { badRequest, serverError } from '../helpers/http-helper';
import { MissingParamError, InvalidParamError } from '../errors';
import {
  EmailValidator,
  Controller,
  HttpRequest,
  HttpResponse
} from '../protocols';
import { AddAcount } from '../../domain/usercases/add-account';

export class SignupController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly account: AddAcount;

  constructor(emailValidator: EmailValidator, account: AddAcount) {
    this.emailValidator = emailValidator;
    this.account = account;
  }
  handle(httpRequest: HttpRequest): HttpResponse {
    try {
      const requiredFields = [
        'name',
        'email',
        'password',
        'passwordConfirmation'
      ];

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field));
        }
      }
      const { password, passwordConfirmation } = httpRequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }

      const isValid = this.emailValidator.isValid(httpRequest.body.email);
      if (!isValid) return badRequest(new InvalidParamError('email'));

      this.account.add({
        name: 'any_name',
        email: 'invalid_email@email',
        password: '123'
      });

      return { body: 'any', statusCode: 34 };
    } catch (error) {
      return serverError();
    }
  }
}
