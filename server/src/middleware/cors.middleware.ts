import cors from 'cors';

export const corsMiddleware = cors({
    origin: true, // allow all origins for production
    credentials: true,
});
