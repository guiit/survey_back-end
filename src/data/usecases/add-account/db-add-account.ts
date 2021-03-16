import { AccountModel } from '../../../domain/models/account';
import {
  AddAccount,
  AddAccountModel
} from '../../../domain/usercases/add-account';
import { Encrypter } from '../protocols/encrypter';

export class DbAddAcount implements AddAccount {
  private readonly encrypter: Encrypter;
  constructor(encrypter: Encrypter) {
    this.encrypter = encrypter;
  }
  async add(account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password);
    const accountModel = Object.assign({ id: 'oi', account });
    return new Promise((resolve) => resolve(accountModel));
  }
}
