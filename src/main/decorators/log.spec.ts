import {
  Controller,
  HttpRequest,
  HttpResponse
} from '../../presentation/protocols';
import { LogControllerDecorator } from './log';

interface SutTypes {
  sut: LogControllerDecorator;
  controllerStub: Controller;
}

const makeController = (): Controller => {
  class ControllerStub implements Controller {
    handle(httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse = {
        body: { name: 'Gui' },
        statusCode: 200
      };
      return new Promise((resolve) => resolve(httpResponse));
    }
  }

  return new ControllerStub();
};
const makeSut = (): SutTypes => {
  const controllerStub = makeController();

  const sut = new LogControllerDecorator(controllerStub);

  return { sut, controllerStub };
};
describe('LogController Decorator', () => {
  test('Should call handle', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');

    const httpRequest = {
      body: {
        email: 'any_mail@mail.com',
        name: 'any_name',
        pasword: 'any_password',
        passwordConfirmation: 'any_password'
      }
    };
    await sut.handle(httpRequest);
    expect(handleSpy).toHaveBeenCalledWith(httpRequest);
  });
});
