/**
 * URL Analyzer Tests
 */

import { analyzeURL, analyzeURLBatch } from '../src/core/urlAnalyzer';

describe('URL Analyzer', () => {
    describe('Valid URLs', () => {
        test('should mark valid HTTPS URL as safe', () => {
            const result = analyzeURL('https://www.google.com');
            expect(result.isValid).toBe(true);
            expect(result.verdict).toBe('safe');
            expect(result.riskScore).toBeLessThan(30);
        });

        test('should handle URL without protocol', () => {
            const result = analyzeURL('example.com');
            expect(result.isValid).toBe(true);
        });

        test('should detect HTTP as less secure', () => {
            const result = analyzeURL('http://example.com');
            expect(result.reasons).toContain('URL does not use HTTPS encryption');
        });
    });

    describe('Invalid URLs', () => {
        test('should reject empty URL', () => {
            const result = analyzeURL('');
            expect(result.isValid).toBe(false);
            expect(result.reasons[0]).toContain('empty');
        });

        test('should reject very long URLs', () => {
            const longUrl = 'https://example.com/' + 'a'.repeat(2100);
            const result = analyzeURL(longUrl);
            expect(result.isValid).toBe(false);
        });

        test('should reject invalid protocol', () => {
            const result = analyzeURL('ftp://example.com');
            expect(result.isValid).toBe(false);
        });
    });

    describe('IP Address Detection', () => {
        test('should detect IPv4 address', () => {
            const result = analyzeURL('http://192.168.1.1/login', true);
            expect(result.features?.hasIP).toBe(true);
            expect(result.riskScore).toBeGreaterThan(30);
            expect(result.reasons).toContain('URL uses IP address instead of domain name');
        });

        test('should not flag normal domain as IP', () => {
            const result = analyzeURL('https://example.com', true);
            expect(result.features?.hasIP).toBe(false);
        });
    });

    describe('Phishing Keyword Detection', () => {
        test('should detect single phishing keyword', () => {
            const result = analyzeURL('https://secure-login-verify.com', true);
            expect(result.features?.suspiciousKeywordCount).toBeGreaterThan(0);
        });

        test('should detect multiple phishing keywords', () => {
            const result = analyzeURL('https://urgent-account-verify-login-update.com', true);
            expect(result.features?.suspiciousKeywordCount).toBeGreaterThanOrEqual(3);
            expect(result.verdict).toBe('suspicious');
        });

        test('should flag high keyword count as malicious', () => {
            const result = analyzeURL('http://free-prize-winner-claim-urgent-verify-account.com');
            expect(result.riskScore).toBeGreaterThan(50);
        });
    });

    describe('Suspicious TLD Detection', () => {
        test('should detect suspicious TLD (.tk)', () => {
            const result = analyzeURL('http://phishing-site.tk', true);
            expect(result.features?.hasSuspiciousTLD).toBe(true);
            expect(result.reasons).toContain('URL uses suspicious top-level domain');
        });

        test('should detect suspicious TLD (.xyz)', () => {
            const result = analyzeURL('https://suspicious.xyz', true);
            expect(result.features?.hasSuspiciousTLD).toBe(true);
        });

        test('should not flag normal TLD', () => {
            const result = analyzeURL('https://example.com', true);
            expect(result.features?.hasSuspiciousTLD).toBe(false);
        });
    });

    describe('Domain Entropy Analysis', () => {
        test('should calculate entropy for normal domain', () => {
            const result = analyzeURL('https://google.com', true);
            expect(result.features?.domainEntropy).toBeLessThan(4.0);
        });

        test('should detect high entropy in random domain', () => {
            const result = analyzeURL('https://xkj3h8f9d2s.com', true);
            expect(result.features?.domainEntropy).toBeGreaterThan(3.5);
        });

        test('should flag very high entropy domains', () => {
            const result = analyzeURL('http://a1b2c3d4e5f6g7h8.com');
            expect(result.riskScore).toBeGreaterThan(0);
        });
    });

    describe('URL Structure Analysis', () => {
        test('should detect excessive dots', () => {
            const result = analyzeURL('https://sub1.sub2.sub3.sub4.example.com', true);
            expect(result.features?.dotCount).toBeGreaterThan(3);
        });

        test('should detect excessive hyphens', () => {
            const result = analyzeURL('https://this-is-a-very-suspicious-domain.com', true);
            expect(result.features?.hyphenCount).toBeGreaterThan(3);
        });

        test('should count subdomains correctly', () => {
            const result = analyzeURL('https://mail.google.com', true);
            expect(result.features?.subdomainCount).toBe(1);
        });

        test('should detect URL shorteners', () => {
            const result = analyzeURL('https://bit.ly/abc123', true);
            expect(result.features?.hasShortener).toBe(true);
            expect(result.reasons).toContain('URL uses a shortening service (hides destination)');
        });
    });

    describe('Risk Score Calculation', () => {
        test('should give low score to safe URLs', () => {
            const result = analyzeURL('https://www.github.com');
            expect(result.riskScore).toBeLessThan(30);
            expect(result.verdict).toBe('safe');
        });

        test('should give medium score to suspicious URLs', () => {
            const result = analyzeURL('http://login-verify-account.tk');
            expect(result.riskScore).toBeGreaterThanOrEqual(30);
            expect(result.riskScore).toBeLessThan(70);
            expect(result.verdict).toBe('suspicious');
        });

        test('should give high score to malicious URLs', () => {
            const result = analyzeURL('http://192.168.1.1/urgent-verify-login-account-suspended.tk');
            expect(result.riskScore).toBeGreaterThanOrEqual(70);
            expect(result.verdict).toBe('malicious');
        });
    });

    describe('Batch Analysis', () => {
        test('should analyze multiple URLs', () => {
            const urls = [
                'https://google.com',
                'http://suspicious-site.tk',
                'http://192.168.1.1/login'
            ];
            const results = analyzeURLBatch(urls);

            expect(results).toHaveLength(3);
            expect(results[0].verdict).toBe('safe');
            expect(results[1].riskScore).toBeGreaterThan(results[0].riskScore);
            expect(results[2].riskScore).toBeGreaterThan(results[1].riskScore);
        });
    });

    describe('Features Flag', () => {
        test('should include features when requested', () => {
            const result = analyzeURL('https://example.com', true);
            expect(result.features).toBeDefined();
            expect(result.features?.urlLength).toBeGreaterThan(0);
        });

        test('should not include features by default', () => {
            const result = analyzeURL('https://example.com');
            expect(result.features).toBeUndefined();
        });
    });

    describe('Edge Cases', () => {
        test('should handle URLs with query parameters', () => {
            const result = analyzeURL('https://example.com?param1=value1&param2=value2', true);
            expect(result.isValid).toBe(true);
            expect(result.features?.queryParamCount).toBeGreaterThan(0);
        });

        test('should handle URLs with long paths', () => {
            const result = analyzeURL('https://example.com/' + 'path/'.repeat(30));
            expect(result.isValid).toBe(true);
        });

        test('should handle URLs with special characters', () => {
            const result = analyzeURL('https://example.com/path?query=hello%20world');
            expect(result.isValid).toBe(true);
        });
    });
});
