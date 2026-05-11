import { Router } from 'express';
import { handleWebhook } from '../controllers/stripe.controller.js';

const router = Router();

router.post('/webhook', handleWebhook);

export default router;
