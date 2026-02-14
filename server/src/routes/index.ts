/**
 * API Routes
 */

import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { checkURL, healthCheck } from '../controllers/scan.controller';
import { validateURLBody } from '../middleware/validation.middleware';

const router = Router();

// Rate limiter: 100 requests per 15 minutes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        error: {
            message: 'Too many requests, please try again later.'
        }
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Health check (no rate limit)
router.get('/health', healthCheck);

// URL checking endpoint (with rate limit and validation)
router.post('/check-url', limiter, validateURLBody, checkURL);

export default router;
