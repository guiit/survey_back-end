import bcrypt from 'bcrypt';
import { BcryptAdapter } from './bcrypt-adapter';

const salt = 12;
const makeSut = (): BcryptAdapter => new BcryptAdapter(salt);

jest.mock('bcrypt', () => ({
  async hash(): Promise<string> {
    return new Promise((resolve) => resolve('hash'));
  }
}));

describe('Bcrypt Adapter', () => {
  test('Should call bcrypt with correct value', () => {
    const sut = makeSut();
    const hashSpy = jest.spyOn(bcrypt, 'hash');
    sut.encrypt('valid_password');

    expect(hashSpy).toHaveBeenCalledWith('valid_password', salt);
  });

  test('Should return hashed password', async () => {
    const sut = makeSut();
    const hash = await sut.encrypt('valid_password');

    expect(hash).toBe('hash');
  });

  test('Should throw if bcrypt throws', async () => {
    const sut = makeSut();
    jest.spyOn(bcrypt, 'hash').mockReturnValueOnce(
      new Promise((resolve, reject) => {
        reject(new Error());
      })
    );

    const promise = sut.encrypt('hash');

    await expect(promise).rejects.toThrow();
  });
});
