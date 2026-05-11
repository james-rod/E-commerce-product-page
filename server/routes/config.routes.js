import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY.trim() });
});

export default router;
