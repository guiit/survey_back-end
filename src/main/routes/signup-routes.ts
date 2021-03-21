import { Router } from 'Express';
import { makeSignUpController } from '../factories/signup';
import { adaptRoute } from '../adapters/express-route-adapter';
export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSignUpController()));
};
