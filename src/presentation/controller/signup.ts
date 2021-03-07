import { HttpRequest, HttpResponse } from '../protocols/http';
import { badRequest } from '../helpers/http-helper';
import { MissingParamError } from '../errors/missing-param-error';

export class SignupController {
  handle(httpRequest: HttpRequest): HttpResponse {
    const requiredFields = ['name', 'email'];
    for (const field of requiredFields)
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamError(`Missing param: ${field}`));
      }

    return { statusCode: 200, body: 'Ok' };
  }
}
