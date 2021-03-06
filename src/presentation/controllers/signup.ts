import { badRequest, ok, serverError } from '../helpers/http-helper';
import { MissingParamError, InvalidParamError } from '../errors';
import {
  EmailValidator,
  Controller,
  HttpRequest,
  HttpResponse
} from '../protocols';
import { AddAccount } from '../../domain/usercases/add-account';

export class SignupController implements Controller {
  private readonly emailValidator: EmailValidator;
  private readonly account: AddAccount;

  constructor(emailValidator: EmailValidator, account: AddAccount) {
    this.emailValidator = emailValidator;
    this.account = account;
  }
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
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
      const { name, email, password, passwordConfirmation } = httpRequest.body;

      if (password !== passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'));
      }

      const isValid = this.emailValidator.isValid(httpRequest.body.email);
      if (!isValid) return badRequest(new InvalidParamError('email'));
      const account = await this.account.add({
        name,
        email,
        password
      });

      return new Promise((resolve) => resolve(ok(account)));
    } catch (error) {
      return serverError();
    }
  }
}
