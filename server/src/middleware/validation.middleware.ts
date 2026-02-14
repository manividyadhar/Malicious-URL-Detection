/**
 * Request Validation Middleware
 */

import { Request, Response, NextFunction } from 'express';

/**
 * Validate URL in request body
 */
export const validateURLBody = (req: Request, res: Response, next: NextFunction) => {
    const { url } = req.body;

    // Check for empty string first (before type check)
    if (url === '') {
        return res.status(400).json({
            error: {
                message: 'URL cannot be empty',
                field: 'url'
            }
        });
    }

    if (!url) {
        return res.status(400).json({
            error: {
                message: 'URL is required',
                field: 'url'
            }
        });
    }

    if (typeof url !== 'string') {
        return res.status(400).json({
            error: {
                message: 'URL must be a string',
                field: 'url'
            }
        });
    }

    if (url.trim().length === 0) {
        return res.status(400).json({
            error: {
                message: 'URL cannot be empty',
                field: 'url'
            }
        });
    }

    if (url.length > 2048) {
        return res.status(400).json({
            error: {
                message: 'URL exceeds maximum length (2048 characters)',
                field: 'url'
            }
        });
    }

    next();
};
