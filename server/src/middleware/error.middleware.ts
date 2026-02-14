/**
 * Error Handling Middleware
 */

import { Request, Response, NextFunction } from 'express';

export interface APIError extends Error {
    statusCode?: number;
    details?: any;
}

/**
 * Global error handler
 */
export const errorHandler = (
    err: APIError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });

    res.status(statusCode).json({
        error: {
            message,
            ...(process.env.NODE_ENV !== 'production' && { details: err.details })
        }
    });
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response) => {
    res.status(404).json({
        error: {
            message: 'Endpoint not found',
            path: req.path
        }
    });
};
