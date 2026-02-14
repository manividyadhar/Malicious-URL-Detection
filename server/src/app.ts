/**
 * Express Application Setup
 */

import express from 'express';
import helmet from 'helmet';
import path from 'path';
import { corsMiddleware } from './middleware/cors.middleware';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import apiRoutes from './routes/index';

const app = express();

// Security middleware
app.use(helmet());

// CORS middleware (configured for extension and web client)
app.use(corsMiddleware);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging (simple)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
});

// API routes
app.use('/api', apiRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    const clientPath = path.join(__dirname, '../../client/dist');

    // Serve static files
    app.use(express.static(clientPath));

    // Serve index.html for all non-API routes (SPA support)
    app.get('*', (req, res) => {
        res.sendFile(path.join(clientPath, 'index.html'));
    });
} else {
    // Development: API info endpoint
    app.get('/', (req, res) => {
        res.json({
            service: 'Malicious URL Detector API',
            version: '1.0.0',
            endpoints: {
                health: 'GET /api/health',
                checkUrl: 'POST /api/check-url'
            },
            documentation: 'https://github.com/manividyadhar/Malicious-URL-Detection'
        });
    });
}

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

export default app;
