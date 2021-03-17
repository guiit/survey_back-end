import { AccountModel } from '../../../domain/models/account';
import { AddAccountModel } from '../../../domain/usercases/add-account';
import { AddAccountRepository } from '../../protocols/add-account-repository';
import { Encrypter } from '../../protocols/encrypter';
import { DbAddAccount } from './db-add-account';

const makeAddAccountRepository = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_password'
      };

      return new Promise((resolve) => resolve(fakeAccount));
    }
  }
  return new AddAccountRepositoryStub();
};

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise((resolve) => resolve('hashed_password'));
    }
  }
  return new EncrypterStub();
};

interface SutTypes {
  sut: DbAddAccount;
  encrypterStub: Encrypter;
  addAccountStub: AddAccountRepository;
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypterStub();
  const addAccountStub = makeAddAccountRepository();
  const sut = new DbAddAccount(encrypterStub, addAccountStub);

  return { sut, encrypterStub, addAccountStub };
};
describe('DbAccount UseCase', () => {
  test('Should call encrypter', async () => {
    const { sut, encrypterStub } = makeSut();
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    };
    await sut.add(accountData);
    expect(encryptSpy).toHaveBeenCalledWith('valid_password');
  });

  test('Should throw if encrypter throws', async () => {
    const { sut, encrypterStub } = makeSut();
    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockImplementation(
        () => new Promise((resolve, reject) => reject(new Error()))
      );

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    };
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  test('Should throws dbAddAccount if addAccountRepository throws', async () => {
    const { sut, addAccountStub } = makeSut();
    jest
      .spyOn(addAccountStub, 'add')
      .mockImplementation(
        () => new Promise((resolve, reject) => reject(new Error()))
      );

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    };
    const promise = sut.add(accountData);
    await expect(promise).rejects.toThrow();
  });

  test('Should return an account if addAccountRepository is called', async () => {
    const { sut } = makeSut();

    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    };
    const account = await sut.add(accountData);
    await expect(account).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_password'
    });
  });
});
