import { Router } from 'Express';
export default (router: Router): void => {
  router.post('/signup', (req, res) => {
    res.json({ ok: 'ok' });
  });
};
