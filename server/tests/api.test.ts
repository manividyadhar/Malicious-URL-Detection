/**
 * API Endpoint Tests
 * 
 * Tests for Express API endpoints
 */

import request from 'supertest';
import app from '../src/app';

describe('API Endpoints', () => {
    describe('GET /api/health', () => {
        test('should return health status', async () => {
            const response = await request(app)
                .get('/api/health')
                .expect(200)
                .expect('Content-Type', /json/);

            expect(response.body).toHaveProperty('status', 'healthy');
            expect(response.body).toHaveProperty('service');
            expect(response.body).toHaveProperty('version');
            expect(response.body).toHaveProperty('timestamp');
            expect(response.body).toHaveProperty('uptime');
        });
    });

    describe('POST /api/check-url', () => {
        describe('Valid Requests', () => {
            test('should analyze safe URL', async () => {
                const response = await request(app)
                    .post('/api/check-url')
                    .send({ url: 'https://www.google.com' })
                    .expect(200)
                    .expect('Content-Type', /json/);

                expect(response.body).toHaveProperty('url', 'https://www.google.com');
                expect(response.body).toHaveProperty('isValid', true);
                expect(response.body).toHaveProperty('verdict', 'safe');
                expect(response.body).toHaveProperty('riskScore');
                expect(response.body.riskScore).toBeLessThan(30);
                expect(response.body).toHaveProperty('reasons');
                expect(response.body).toHaveProperty('features');
                expect(response.body).toHaveProperty('processingTimeMs');
                expect(response.body).toHaveProperty('timestamp');
            });

            test('should analyze suspicious URL', async () => {
                const response = await request(app)
                    .post('/api/check-url')
                    .send({ url: 'http://login-verify.xyz' })
                    .expect(200);

                expect(response.body.verdict).toBe('suspicious');
                expect(response.body.riskScore).toBeGreaterThanOrEqual(30);
                expect(response.body.riskScore).toBeLessThan(70);
                expect(response.body.reasons.length).toBeGreaterThan(0);
            });

            test('should analyze malicious URL', async () => {
                const response = await request(app)
                    .post('/api/check-url')
                    .send({ url: 'http://192.168.1.1/urgent-verify-login.tk' })
                    .expect(200);

                expect(response.body.verdict).toBe('malicious');
                expect(response.body.riskScore).toBeGreaterThanOrEqual(70);
                expect(response.body.reasons.length).toBeGreaterThan(0);
            });

            test('should handle URL without protocol', async () => {
                const response = await request(app)
                    .post('/api/check-url')
                    .send({ url: 'example.com' })
                    .expect(200);

                expect(response.body.isValid).toBe(true);
            });

            test('should include processing time', async () => {
                const response = await request(app)
                    .post('/api/check-url')
                    .send({ url: 'https://example.com' })
                    .expect(200);

                expect(response.body.processingTimeMs).toBeDefined();
                expect(typeof response.body.processingTimeMs).toBe('number');
                expect(response.body.processingTimeMs).toBeGreaterThan(0);
            });
        });

        describe('Invalid Requests', () => {
            test('should reject request without URL', async () => {
                const response = await request(app)
                    .post('/api/check-url')
                    .send({})
                    .expect(400);

                expect(response.body).toHaveProperty('error');
                expect(response.body.error).toHaveProperty('message', 'URL is required');
                expect(response.body.error).toHaveProperty('field', 'url');
            });

            test('should reject empty URL', async () => {
                const response = await request(app)
                    .post('/api/check-url')
                    .send({ url: '' })
                    .expect(400);

                expect(response.body.error.message).toBe('URL cannot be empty');
            });

            test('should reject non-string URL', async () => {
                const response = await request(app)
                    .post('/api/check-url')
                    .send({ url: 12345 })
                    .expect(400);

                expect(response.body.error.message).toBe('URL must be a string');
            });

            test('should reject very long URL', async () => {
                const longUrl = 'https://example.com/' + 'a'.repeat(2100);
                const response = await request(app)
                    .post('/api/check-url')
                    .send({ url: longUrl })
                    .expect(400);

                expect(response.body.error.message).toContain('exceeds maximum length');
            });

            test('should reject whitespace-only URL', async () => {
                const response = await request(app)
                    .post('/api/check-url')
                    .send({ url: '   ' })
                    .expect(400);

                expect(response.body.error.message).toBe('URL cannot be empty');
            });
        });

        describe('Real-World URLs', () => {
            const testCases = [
                { url: 'https://github.com', expectedVerdict: 'safe' },
                { url: 'https://stackoverflow.com', expectedVerdict: 'safe' },
                { url: 'http://login-verify-account.tk', expectedVerdict: 'suspicious' },
                { url: 'http://192.168.1.1/login', expectedVerdict: 'malicious' },
                { url: 'http://free-prize-winner.ml', expectedVerdict: 'suspicious' }
            ];

            test.each(testCases)('should correctly analyze $url', async ({ url, expectedVerdict }) => {
                const response = await request(app)
                    .post('/api/check-url')
                    .send({ url })
                    .expect(200);

                expect(response.body.verdict).toBe(expectedVerdict);
            });
        });

        describe('Response Format', () => {
            test('should return consistent response structure', async () => {
                const response = await request(app)
                    .post('/api/check-url')
                    .send({ url: 'https://example.com' })
                    .expect(200);

                // Required fields
                expect(response.body).toHaveProperty('url');
                expect(response.body).toHaveProperty('isValid');
                expect(response.body).toHaveProperty('riskScore');
                expect(response.body).toHaveProperty('verdict');
                expect(response.body).toHaveProperty('reasons');
                expect(response.body).toHaveProperty('features');
                expect(response.body).toHaveProperty('processingTimeMs');
                expect(response.body).toHaveProperty('timestamp');

                // Type checks
                expect(typeof response.body.url).toBe('string');
                expect(typeof response.body.isValid).toBe('boolean');
                expect(typeof response.body.riskScore).toBe('number');
                expect(typeof response.body.verdict).toBe('string');
                expect(Array.isArray(response.body.reasons)).toBe(true);
                expect(typeof response.body.features).toBe('object');
                expect(typeof response.body.processingTimeMs).toBe('number');
                expect(typeof response.body.timestamp).toBe('string');
            });

            test('should include all feature properties', async () => {
                const response = await request(app)
                    .post('/api/check-url')
                    .send({ url: 'https://example.com' })
                    .expect(200);

                const features = response.body.features;
                expect(features).toHaveProperty('urlLength');
                expect(features).toHaveProperty('domainLength');
                expect(features).toHaveProperty('hasIP');
                expect(features).toHaveProperty('hasHTTPS');
                expect(features).toHaveProperty('dotCount');
                expect(features).toHaveProperty('hyphenCount');
                expect(features).toHaveProperty('specialCharCount');
                expect(features).toHaveProperty('subdomainCount');
                expect(features).toHaveProperty('suspiciousKeywordCount');
                expect(features).toHaveProperty('hasSuspiciousTLD');
                expect(features).toHaveProperty('hasShortener');
                expect(features).toHaveProperty('domainEntropy');
                expect(features).toHaveProperty('pathLength');
                expect(features).toHaveProperty('queryParamCount');
            });
        });

        describe('Edge Cases', () => {
            test('should handle URLs with query parameters', async () => {
                const response = await request(app)
                    .post('/api/check-url')
                    .send({ url: 'https://example.com?param=value&other=test' })
                    .expect(200);

                expect(response.body.isValid).toBe(true);
            });

            test('should handle URLs with fragments', async () => {
                const response = await request(app)
                    .post('/api/check-url')
                    .send({ url: 'https://example.com#section' })
                    .expect(200);

                expect(response.body.isValid).toBe(true);
            });

            test('should handle URLs with ports', async () => {
                const response = await request(app)
                    .post('/api/check-url')
                    .send({ url: 'https://example.com:8080' })
                    .expect(200);

                expect(response.body.isValid).toBe(true);
            });

            test('should handle URLs with authentication', async () => {
                const response = await request(app)
                    .post('/api/check-url')
                    .send({ url: 'https://user:pass@example.com' })
                    .expect(200);

                expect(response.body.isValid).toBe(true);
            });
        });
    });

    describe('Rate Limiting', () => {
        test('should allow reasonable number of requests', async () => {
            // Make 10 requests (well under the 100/15min limit)
            const requests = Array(10).fill(null).map(() =>
                request(app)
                    .post('/api/check-url')
                    .send({ url: 'https://example.com' })
            );

            const responses = await Promise.all(requests);
            responses.forEach(response => {
                expect(response.status).toBe(200);
            });
        });
    });

    describe('CORS', () => {
        test('should include CORS headers', async () => {
            const response = await request(app)
                .get('/api/health')
                .set('Origin', 'http://localhost:3000');

            expect(response.headers).toHaveProperty('access-control-allow-origin');
        });
    });

    describe('404 Handler', () => {
        test('should return 404 for unknown endpoints', async () => {
            const response = await request(app)
                .get('/api/unknown')
                .expect(404);

            expect(response.body).toHaveProperty('error');
            expect(response.body.error).toHaveProperty('message', 'Endpoint not found');
        });
    });

    describe('Error Handling', () => {
        test('should handle malformed JSON', async () => {
            const response = await request(app)
                .post('/api/check-url')
                .set('Content-Type', 'application/json')
                .send('invalid json')
                .expect(400);

            expect(response.body).toHaveProperty('error');
        });
    });
});
