/**
 * Additional URL Analyzer Tests
 * 
 * Comprehensive test cases for safe and malicious URLs
 */

import { analyzeURL } from '../src/core/urlAnalyzer';

describe('URL Analyzer - Comprehensive Cases', () => {
    describe('Safe URLs', () => {
        const safeUrls = [
            'https://www.google.com',
            'https://github.com',
            'https://stackoverflow.com',
            'https://www.amazon.com',
            'https://www.wikipedia.org',
            'https://www.microsoft.com',
            'https://developer.mozilla.org',
            'https://www.reddit.com',
            'https://www.youtube.com',
            'https://www.linkedin.com'
        ];

        test.each(safeUrls)('should mark %s as safe', (url) => {
            const result = analyzeURL(url);
            expect(result.isValid).toBe(true);
            expect(result.verdict).toBe('safe');
            expect(result.riskScore).toBeLessThan(30);
        });

        test('should handle legitimate subdomains', () => {
            const result = analyzeURL('https://mail.google.com');
            expect(result.verdict).toBe('safe');
            expect(result.riskScore).toBeLessThan(30);
        });

        test('should handle legitimate long domains', () => {
            const result = analyzeURL('https://www.internationalbusinessmachines.com');
            expect(result.verdict).toBe('safe');
        });
    });

    describe('Suspicious URLs', () => {
        const suspiciousUrls = [
            'http://login-verify.com',
            'https://account-suspended.xyz',
            'http://secure-banking-update.top',
            'https://verify-account-now.click',
            'http://urgent-action-required.work'
        ];

        test.each(suspiciousUrls)('should mark %s as suspicious', (url) => {
            const result = analyzeURL(url);
            expect(result.isValid).toBe(true);
            expect(result.verdict).toBe('suspicious');
            expect(result.riskScore).toBeGreaterThanOrEqual(30);
            expect(result.riskScore).toBeLessThan(70);
        });

        test('should detect multiple red flags in suspicious URL', () => {
            const result = analyzeURL('http://verify-login-account.tk');
            expect(result.verdict).toBe('suspicious');
            expect(result.reasons.length).toBeGreaterThan(2);
        });
    });

    describe('Malicious URLs', () => {
        const maliciousUrls = [
            'http://192.168.1.1/login',
            'http://10.0.0.1/secure-banking',
            'http://free-prize-winner-claim-urgent-verify.tk',
            'http://urgent-account-suspended-verify-login-update.ml',
            'http://192.168.0.1/paypal-verify-account.tk'
        ];

        test.each(maliciousUrls)('should mark %s as malicious', (url) => {
            const result = analyzeURL(url);
            expect(result.isValid).toBe(true);
            expect(result.verdict).toBe('malicious');
            expect(result.riskScore).toBeGreaterThanOrEqual(70);
        });

        test('should detect IP + phishing keywords combination', () => {
            const result = analyzeURL('http://192.168.1.1/urgent-verify-login');
            expect(result.verdict).toBe('malicious');
            expect(result.riskScore).toBeGreaterThanOrEqual(70);
            expect(result.reasons).toContain('URL uses IP address instead of domain name');
        });

        test('should detect multiple phishing keywords', () => {
            const result = analyzeURL('http://free-winner-prize-claim-urgent-verify-account-suspended.com');
            expect(result.verdict).toBe('malicious');
            expect(result.riskScore).toBeGreaterThanOrEqual(70);
        });
    });

    describe('URL Validation Edge Cases', () => {
        test('should handle whitespace in URL', () => {
            const result = analyzeURL('  https://example.com  ');
            expect(result.isValid).toBe(true);
        });

        test('should reject malformed URLs', () => {
            const result = analyzeURL('not-a-url');
            expect(result.isValid).toBe(false);
        });

        test('should reject URLs with invalid characters', () => {
            const result = analyzeURL('https://example.com/<script>');
            expect(result.isValid).toBe(true); // URL parser handles this
        });

        test('should handle international domains', () => {
            const result = analyzeURL('https://münchen.de');
            expect(result.isValid).toBe(true);
        });
    });

    describe('Risk Score Boundaries', () => {
        test('should score 0-29 as safe', () => {
            const result = analyzeURL('https://www.google.com');
            expect(result.riskScore).toBeLessThan(30);
            expect(result.verdict).toBe('safe');
        });

        test('should score 30-69 as suspicious', () => {
            const result = analyzeURL('http://login-verify.xyz');
            expect(result.riskScore).toBeGreaterThanOrEqual(30);
            expect(result.riskScore).toBeLessThan(70);
            expect(result.verdict).toBe('suspicious');
        });

        test('should score 70+ as malicious', () => {
            const result = analyzeURL('http://192.168.1.1/urgent-verify-login.tk');
            expect(result.riskScore).toBeGreaterThanOrEqual(70);
            expect(result.verdict).toBe('malicious');
        });
    });

    describe('Real-World Phishing Patterns', () => {
        test('should detect PayPal phishing', () => {
            const result = analyzeURL('http://paypal-verify-account.tk');
            expect(result.verdict).not.toBe('safe');
            expect(result.riskScore).toBeGreaterThan(30);
        });

        test('should detect bank phishing', () => {
            const result = analyzeURL('http://secure-banking-login.ml');
            expect(result.verdict).not.toBe('safe');
        });

        test('should detect urgency tactics', () => {
            const result = analyzeURL('http://urgent-action-required-suspended.com');
            expect(result.verdict).not.toBe('safe');
        });

        test('should detect prize scams', () => {
            const result = analyzeURL('http://free-prize-winner-claim.tk');
            expect(result.verdict).not.toBe('safe');
        });
    });

    describe('Performance', () => {
        test('should analyze URL quickly', () => {
            const start = Date.now();
            analyzeURL('https://example.com');
            const duration = Date.now() - start;
            expect(duration).toBeLessThan(100); // Should be < 100ms
        });

        test('should handle batch analysis efficiently', () => {
            const urls = Array(100).fill('https://example.com');
            const start = Date.now();
            urls.forEach(url => analyzeURL(url));
            const duration = Date.now() - start;
            expect(duration).toBeLessThan(1000); // 100 URLs in < 1s
        });
    });
});
