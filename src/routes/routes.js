import { Router } from 'express';
import authController from '../modules/auth/auth.controller.js';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

router.post('/auth/login', authController.login);

export default router;
