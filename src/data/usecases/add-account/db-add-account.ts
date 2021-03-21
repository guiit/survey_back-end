import { AccountModel } from '../../../domain/models/account';
import {
  AddAccount,
  AddAccountModel
} from '../../../domain/usercases/add-account';
import { AddAccountRepository } from '../../protocols/add-account-repository';
import { Encrypter } from '../../protocols/encrypter';

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter;
  private readonly addAccountStub: AddAccountRepository;
  constructor(encrypter: Encrypter, addAccountStub: AddAccountRepository) {
    this.encrypter = encrypter;
    this.addAccountStub = addAccountStub;
  }
  async add(accountData: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(accountData.password);
    const acountInsert = Object.assign({}, { id: 'valid_id' }, accountData);
    const account = await this.addAccountStub.add(acountInsert);

    return new Promise((resolve) => resolve(account));
  }
}
