import request from 'supertest';
import env from '../config/env';
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper';
import app from '../config/app';

describe('Signup route', () => {
  beforeAll(async () => {
    await MongoHelper.connect(env.mongoUrl);
  });
  afterAll(async () => {
    await MongoHelper.disconnect();
  });

  test('Should return an account on sucess', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'fadf',
        email: 'guilhermesda@email.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200);
  });
});
