import { Router } from 'express';
import apiV1Routes from './api-v1';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.use('/v1', apiV1Routes);

export default router;
