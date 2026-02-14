"use strict";
/**
 * URL Analyzer - Shared Detection Engine
 *
 * Provides comprehensive URL analysis for malicious content detection.
 * Used across CLI, Extension, and Server platforms.
 *
 * Features:
 * - URL validation
 * - Phishing keyword detection
 * - Suspicious TLD detection
 * - IP address detection
 * - Domain entropy analysis
 * - Heuristic risk scoring
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeURL = analyzeURL;
exports.analyzeURLBatch = analyzeURLBatch;
// ============================================================================
// Constants
// ============================================================================
/**
 * Phishing-related keywords commonly found in malicious URLs
 */
const PHISHING_KEYWORDS = [
    'login', 'signin', 'verify', 'update', 'secure', 'account',
    'confirm', 'validate', 'activate', 'suspended', 'locked',
    'urgent', 'click', 'limited', 'offer', 'prize', 'winner',
    'free', 'bonus', 'reward', 'claim', 'congratulations',
    'bank', 'paypal', 'amazon', 'apple', 'microsoft', 'google',
    'password', 'credential', 'billing', 'payment', 'wallet',
    'security', 'alert', 'warning', 'action', 'required',
    'expire', 'suspend', 'restore', 'unlock', 'recover',
    'download', 'install', 'upgrade', 'renew', 'subscribe'
];
/**
 * Suspicious top-level domains often used in phishing
 */
const SUSPICIOUS_TLDS = [
    '.tk', '.ml', '.ga', '.cf', '.gq', // Free domains
    '.xyz', '.top', '.work', '.click', '.link', // Cheap domains
    '.loan', '.win', '.bid', '.racing', '.download',
    '.stream', '.review', '.trade', '.accountant',
    '.science', '.party', '.gdn', '.mom', '.kim'
];
/**
 * Known URL shortening services
 */
const URL_SHORTENERS = [
    'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly',
    'is.gd', 'buff.ly', 'adf.ly', 'short.link', 'rebrand.ly',
    'cutt.ly', 'tiny.cc', 'cli.gs', 'shorturl.at', 'v.gd'
];
// ============================================================================
// URL Validation
// ============================================================================
/**
 * Validate URL format and structure
 */
function validateURL(url) {
    // Check for empty string first
    if (url === '') {
        return { valid: false, parsed: null, error: 'URL is empty' };
    }
    // Basic checks
    if (!url || typeof url !== 'string') {
        return { valid: false, parsed: null, error: 'URL is required and must be a string' };
    }
    const trimmedUrl = url.trim();
    // Check for whitespace-only after trim
    if (trimmedUrl.length === 0) {
        return { valid: false, parsed: null, error: 'URL is empty' };
    }
    if (trimmedUrl.length > 2048) {
        return { valid: false, parsed: null, error: 'URL exceeds maximum length (2048 characters)' };
    }
    // Add protocol if missing (but validate it looks like a URL)
    let urlToValidate = trimmedUrl;
    // Check if URL already has a protocol (any protocol, not just http/https)
    if (!trimmedUrl.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//)) {
        // Check if it looks like a valid domain/URL before adding protocol
        // Must have at least one dot or be localhost
        if (!trimmedUrl.includes('.') && trimmedUrl !== 'localhost') {
            return { valid: false, parsed: null, error: 'Invalid URL format' };
        }
        urlToValidate = 'https://' + trimmedUrl;
    }
    // Try to parse URL
    try {
        const parsed = new URL(urlToValidate);
        // Validate protocol
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return { valid: false, parsed: null, error: 'Invalid protocol (only HTTP/HTTPS allowed)' };
        }
        // Validate hostname
        if (!parsed.hostname || parsed.hostname.length === 0) {
            return { valid: false, parsed: null, error: 'Invalid hostname' };
        }
        return { valid: true, parsed };
    }
    catch (error) {
        return { valid: false, parsed: null, error: 'Invalid URL format' };
    }
}
// ============================================================================
// Feature Extraction
// ============================================================================
/**
 * Check if URL contains an IP address instead of domain name
 */
function hasIPAddress(hostname) {
    // IPv4 pattern
    const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    // IPv6 pattern (simplified)
    const ipv6Pattern = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
    // Check if hostname matches IP patterns
    if (ipv4Pattern.test(hostname)) {
        // Validate IPv4 octets
        const octets = hostname.split('.');
        return octets.every(octet => {
            const num = parseInt(octet, 10);
            return num >= 0 && num <= 255;
        });
    }
    if (ipv6Pattern.test(hostname)) {
        return true;
    }
    // Check for IP in brackets (IPv6)
    if (hostname.startsWith('[') && hostname.endsWith(']')) {
        return true;
    }
    return false;
}
/**
 * Count phishing keywords in URL
 */
function countPhishingKeywords(url) {
    const urlLower = url.toLowerCase();
    let count = 0;
    for (const keyword of PHISHING_KEYWORDS) {
        if (urlLower.includes(keyword)) {
            count++;
        }
    }
    return count;
}
/**
 * Check if URL uses suspicious TLD
 */
function hasSuspiciousTLD(hostname) {
    const hostnameLower = hostname.toLowerCase();
    for (const tld of SUSPICIOUS_TLDS) {
        if (hostnameLower.endsWith(tld)) {
            return true;
        }
    }
    return false;
}
/**
 * Check if URL uses a shortening service
 */
function hasURLShortener(hostname) {
    const hostnameLower = hostname.toLowerCase();
    for (const shortener of URL_SHORTENERS) {
        if (hostnameLower.includes(shortener)) {
            return true;
        }
    }
    return false;
}
/**
 * Calculate Shannon entropy of domain name
 * Higher entropy suggests random/generated domains
 */
function calculateDomainEntropy(domain) {
    if (!domain || domain.length === 0) {
        return 0;
    }
    // Count character frequencies
    const frequencies = {};
    for (const char of domain) {
        frequencies[char] = (frequencies[char] || 0) + 1;
    }
    // Calculate entropy
    let entropy = 0;
    const len = domain.length;
    for (const char in frequencies) {
        const probability = frequencies[char] / len;
        entropy -= probability * Math.log2(probability);
    }
    return entropy;
}
/**
 * Count special characters (excluding common URL chars)
 */
function countSpecialChars(url) {
    // Match characters that are NOT: alphanumeric, :, /, ?, =, &, -, ., _, ~, #, %
    const specialChars = url.match(/[^a-zA-Z0-9:/?=&.\-_~#%]/g);
    return specialChars ? specialChars.length : 0;
}
/**
 * Count subdomains in hostname
 */
function countSubdomains(hostname) {
    // Remove port if present
    const hostWithoutPort = hostname.split(':')[0];
    // Split by dots
    const parts = hostWithoutPort.split('.');
    // Minimum valid domain has 2 parts (domain.tld)
    // Anything more than 2 is a subdomain
    if (parts.length <= 2) {
        return 0;
    }
    // Count parts beyond domain.tld
    return parts.length - 2;
}
/**
 * Extract all features from URL
 */
function extractFeatures(url, parsed) {
    const hostname = parsed.hostname;
    const path = parsed.pathname;
    const search = parsed.search;
    return {
        urlLength: url.length,
        domainLength: hostname.length,
        hasIP: hasIPAddress(hostname),
        hasHTTPS: parsed.protocol === 'https:',
        dotCount: url.split('.').length - 1,
        hyphenCount: url.split('-').length - 1,
        specialCharCount: countSpecialChars(url),
        subdomainCount: countSubdomains(hostname),
        suspiciousKeywordCount: countPhishingKeywords(url),
        hasSuspiciousTLD: hasSuspiciousTLD(hostname),
        hasShortener: hasURLShortener(hostname),
        domainEntropy: calculateDomainEntropy(hostname.replace(/\./g, '')),
        pathLength: path.length,
        queryParamCount: search ? search.split('&').length : 0
    };
}
// ============================================================================
// Heuristic Scoring
// ============================================================================
/**
 * Calculate risk score based on extracted features
 * Returns score (0-100) and reasons
 */
function calculateRiskScore(features) {
    let score = 0;
    const reasons = [];
    // URL Length Analysis
    if (features.urlLength > 200) {
        score += 15;
        reasons.push(`Very long URL (${features.urlLength} characters)`);
    }
    else if (features.urlLength > 100) {
        score += 8;
        reasons.push(`Long URL (${features.urlLength} characters)`);
    }
    // IP Address Detection (highly suspicious)
    if (features.hasIP) {
        score += 40;
        reasons.push('URL uses IP address instead of domain name');
    }
    // HTTPS Check
    if (!features.hasHTTPS) {
        score += 15;
        reasons.push('URL does not use HTTPS encryption');
    }
    // Excessive Dots (subdomain obfuscation)
    if (features.dotCount > 5) {
        score += 20;
        reasons.push(`Excessive dots (${features.dotCount}) - possible subdomain obfuscation`);
    }
    else if (features.dotCount > 3) {
        score += 10;
        reasons.push(`Multiple dots (${features.dotCount})`);
    }
    // Excessive Hyphens
    if (features.hyphenCount > 5) {
        score += 15;
        reasons.push(`Excessive hyphens (${features.hyphenCount})`);
    }
    else if (features.hyphenCount > 3) {
        score += 7;
        reasons.push(`Multiple hyphens (${features.hyphenCount})`);
    }
    // Special Characters
    if (features.specialCharCount > 10) {
        score += 20;
        reasons.push(`Many special characters (${features.specialCharCount})`);
    }
    else if (features.specialCharCount > 5) {
        score += 10;
        reasons.push(`Special characters present (${features.specialCharCount})`);
    }
    // Subdomain Count
    if (features.subdomainCount > 3) {
        score += 15;
        reasons.push(`Excessive subdomains (${features.subdomainCount})`);
    }
    else if (features.subdomainCount > 1) {
        score += 7;
        reasons.push(`Multiple subdomains (${features.subdomainCount})`);
    }
    // Phishing Keywords
    if (features.suspiciousKeywordCount >= 5) {
        score += 40;
        reasons.push(`Multiple phishing keywords detected (${features.suspiciousKeywordCount})`);
    }
    else if (features.suspiciousKeywordCount >= 3) {
        score += 30;
        reasons.push(`Multiple phishing keywords detected (${features.suspiciousKeywordCount})`);
    }
    else if (features.suspiciousKeywordCount === 2) {
        score += 15;
        reasons.push(`Suspicious keywords detected (${features.suspiciousKeywordCount})`);
    }
    else if (features.suspiciousKeywordCount === 1) {
        score += 8;
        reasons.push('Suspicious keyword detected');
    }
    // Suspicious TLD
    if (features.hasSuspiciousTLD) {
        score += 20;
        reasons.push('URL uses suspicious top-level domain');
    }
    // URL Shortener
    if (features.hasShortener) {
        score += 10;
        reasons.push('URL uses a shortening service (hides destination)');
    }
    // Domain Entropy (randomness check)
    // High entropy (>4.0) suggests random/generated domain
    if (features.domainEntropy > 4.5) {
        score += 20;
        reasons.push(`High domain entropy (${features.domainEntropy.toFixed(2)}) - possibly randomly generated`);
    }
    else if (features.domainEntropy > 4.0) {
        score += 10;
        reasons.push(`Elevated domain entropy (${features.domainEntropy.toFixed(2)})`);
    }
    // Long path (potential obfuscation)
    if (features.pathLength > 100) {
        score += 10;
        reasons.push(`Very long URL path (${features.pathLength} characters)`);
    }
    // Many query parameters (potential tracking/obfuscation)
    if (features.queryParamCount > 10) {
        score += 8;
        reasons.push(`Many query parameters (${features.queryParamCount})`);
    }
    // Cap score at 100
    score = Math.min(score, 100);
    // If no issues found, add safe indicator
    if (reasons.length === 0) {
        reasons.push('No suspicious patterns detected');
    }
    return { score, reasons };
}
/**
 * Determine verdict based on risk score
 */
function getVerdict(score) {
    if (score < 30) {
        return 'safe';
    }
    else if (score < 70) {
        return 'suspicious';
    }
    else {
        return 'malicious';
    }
}
// ============================================================================
// Main Analysis Function
// ============================================================================
/**
 * Analyze URL for malicious content
 *
 * @param url - URL string to analyze
 * @param includeFeatures - Include detailed features in response (default: false)
 * @returns Analysis result with risk score, verdict, and reasons
 *
 * @example
 * ```typescript
 * const result = analyzeURL('https://example.com');
 * console.log(result.verdict); // 'safe'
 * console.log(result.riskScore); // 0
 * ```
 */
function analyzeURL(url, _includeFeatures) {
    // Validate URL
    const validation = validateURL(url);
    if (!validation.valid) {
        return {
            isValid: false,
            riskScore: 0,
            verdict: 'safe',
            reasons: [validation.error || 'Invalid URL']
        };
    }
    const parsed = validation.parsed;
    // Extract features
    const features = extractFeatures(url, parsed);
    // Calculate risk score
    const { score, reasons } = calculateRiskScore(features);
    // Determine verdict
    const verdict = getVerdict(score);
    // Build result
    const result = {
        isValid: true,
        riskScore: score,
        verdict,
        reasons
    };
    // Include features only if explicitly requested
    if (_includeFeatures === true) {
        result.features = features;
    }
    return result;
}
// ============================================================================
// Batch Analysis
// ============================================================================
/**
 * Analyze multiple URLs in batch
 *
 * @param urls - Array of URL strings to analyze
 * @returns Array of analysis results
 */
function analyzeURLBatch(urls, _includeFeatures) {
    return urls.map(url => analyzeURL(url));
}
// ============================================================================
// Exports
// ============================================================================
exports.default = {
    analyzeURL,
    analyzeURLBatch
};
