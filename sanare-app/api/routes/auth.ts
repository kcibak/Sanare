import { Router } from 'express';
import { AuthController } from '../controllers/authcontroller';

const router = Router();

// POST /api/v1/auth/login
router.post('/login', (req, res, next) => {
  AuthController.login(req, res).catch(next);
});

export default router;
