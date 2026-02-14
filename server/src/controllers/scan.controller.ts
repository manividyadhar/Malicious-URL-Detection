/**
 * URL Scan Controller
 * 
 * Handles URL analysis requests using shared detection engine
 */

import { Request, Response, NextFunction } from 'express';
import { analyzeURL } from '@malicious-url-detector/shared';

/**
 * Check URL for malicious content
 * POST /api/check-url
 */
export const checkURL = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { url } = req.body;
        const startTime = Date.now();

        // Analyze URL using shared detection engine
        const result = analyzeURL(url, true); // Include features

        const processingTime = Math.max(1, Date.now() - startTime);

        // Return structured response
        res.json({
            url,
            isValid: result.isValid,
            riskScore: result.riskScore,
            verdict: result.verdict,
            reasons: result.reasons,
            features: result.features,
            processingTimeMs: processingTime,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Health check endpoint
 * GET /api/health
 */
export const healthCheck = (req: Request, res: Response) => {
    res.json({
        status: 'healthy',
        service: 'malicious-url-detector-api',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
};
