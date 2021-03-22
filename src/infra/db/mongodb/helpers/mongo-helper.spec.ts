import { MongoHelper as sut } from './mongo-helper';

describe('Mongodb connection', () => {
  beforeAll(async () => {
    await sut.connect(String(process.env.MONGO_URL));
  });
  afterAll(async () => {
    await sut.disconnect();
  });
  test('Should reconnect if mongodb is down', async () => {
    const accountCollection = await sut.getCollection('accounts');
    await sut.disconnect();
    expect(accountCollection).toBeTruthy();
    const account = await sut.getCollection('accounts');
    expect(account).toBeTruthy();
  });
});
