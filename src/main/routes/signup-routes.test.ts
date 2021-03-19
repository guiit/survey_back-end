import request from 'supertest';
import app from '../config/app';

describe('Signup route', () => {
  test('Should return an account on sucess', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Guilherme',
        email: 'guilherme@hotmail.com',
        password: '123',
        confirmationPassword: '123'
      })
      .expect(200);
  });
});
