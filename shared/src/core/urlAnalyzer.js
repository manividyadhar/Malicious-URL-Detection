"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeURL = analyzeURL;
exports.analyzeURLBatch = analyzeURLBatch;
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
const SUSPICIOUS_TLDS = [
    '.tk', '.ml', '.ga', '.cf', '.gq',
    '.xyz', '.top', '.work', '.click', '.link',
    '.loan', '.win', '.bid', '.racing', '.download',
    '.stream', '.review', '.trade', '.accountant',
    '.science', '.party', '.gdn', '.mom', '.kim'
];
const URL_SHORTENERS = [
    'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly',
    'is.gd', 'buff.ly', 'adf.ly', 'short.link', 'rebrand.ly',
    'cutt.ly', 'tiny.cc', 'cli.gs', 'shorturl.at', 'v.gd'
];
function validateURL(url) {
    if (url === '') {
        return { valid: false, parsed: null, error: 'URL is empty' };
    }
    if (!url || typeof url !== 'string') {
        return { valid: false, parsed: null, error: 'URL is required and must be a string' };
    }
    const trimmedUrl = url.trim();
    if (trimmedUrl.length === 0) {
        return { valid: false, parsed: null, error: 'URL is empty' };
    }
    if (trimmedUrl.length > 2048) {
        return { valid: false, parsed: null, error: 'URL exceeds maximum length (2048 characters)' };
    }
    let urlToValidate = trimmedUrl;
    if (!trimmedUrl.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//)) {
        if (!trimmedUrl.includes('.') && trimmedUrl !== 'localhost') {
            return { valid: false, parsed: null, error: 'Invalid URL format' };
        }
        urlToValidate = 'https://' + trimmedUrl;
    }
    try {
        const parsed = new URL(urlToValidate);
        if (!['http:', 'https:'].includes(parsed.protocol)) {
            return { valid: false, parsed: null, error: 'Invalid protocol (only HTTP/HTTPS allowed)' };
        }
        if (!parsed.hostname || parsed.hostname.length === 0) {
            return { valid: false, parsed: null, error: 'Invalid hostname' };
        }
        return { valid: true, parsed };
    }
    catch (error) {
        return { valid: false, parsed: null, error: 'Invalid URL format' };
    }
}
function hasIPAddress(hostname) {
    const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Pattern = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
    if (ipv4Pattern.test(hostname)) {
        const octets = hostname.split('.');
        return octets.every(octet => {
            const num = parseInt(octet, 10);
            return num >= 0 && num <= 255;
        });
    }
    if (ipv6Pattern.test(hostname)) {
        return true;
    }
    if (hostname.startsWith('[') && hostname.endsWith(']')) {
        return true;
    }
    return false;
}
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
function hasSuspiciousTLD(hostname) {
    const hostnameLower = hostname.toLowerCase();
    for (const tld of SUSPICIOUS_TLDS) {
        if (hostnameLower.endsWith(tld)) {
            return true;
        }
    }
    return false;
}
function hasURLShortener(hostname) {
    const hostnameLower = hostname.toLowerCase();
    for (const shortener of URL_SHORTENERS) {
        if (hostnameLower.includes(shortener)) {
            return true;
        }
    }
    return false;
}
function calculateDomainEntropy(domain) {
    if (!domain || domain.length === 0) {
        return 0;
    }
    const frequencies = {};
    for (const char of domain) {
        frequencies[char] = (frequencies[char] || 0) + 1;
    }
    let entropy = 0;
    const len = domain.length;
    for (const char in frequencies) {
        const probability = frequencies[char] / len;
        entropy -= probability * Math.log2(probability);
    }
    return entropy;
}
function countSpecialChars(url) {
    const specialChars = url.match(/[^a-zA-Z0-9:/?=&.\-_~#%]/g);
    return specialChars ? specialChars.length : 0;
}
function countSubdomains(hostname) {
    const hostWithoutPort = hostname.split(':')[0];
    const parts = hostWithoutPort.split('.');
    if (parts.length <= 2) {
        return 0;
    }
    return parts.length - 2;
}
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
function calculateRiskScore(features) {
    let score = 0;
    const reasons = [];
    if (features.urlLength > 200) {
        score += 15;
        reasons.push(`Very long URL (${features.urlLength} characters)`);
    }
    else if (features.urlLength > 100) {
        score += 8;
        reasons.push(`Long URL (${features.urlLength} characters)`);
    }
    if (features.hasIP) {
        score += 40;
        reasons.push('URL uses IP address instead of domain name');
    }
    if (!features.hasHTTPS) {
        score += 15;
        reasons.push('URL does not use HTTPS encryption');
    }
    if (features.dotCount > 5) {
        score += 20;
        reasons.push(`Excessive dots (${features.dotCount}) - possible subdomain obfuscation`);
    }
    else if (features.dotCount > 3) {
        score += 10;
        reasons.push(`Multiple dots (${features.dotCount})`);
    }
    if (features.hyphenCount > 5) {
        score += 15;
        reasons.push(`Excessive hyphens (${features.hyphenCount})`);
    }
    else if (features.hyphenCount > 3) {
        score += 7;
        reasons.push(`Multiple hyphens (${features.hyphenCount})`);
    }
    if (features.specialCharCount > 10) {
        score += 20;
        reasons.push(`Many special characters (${features.specialCharCount})`);
    }
    else if (features.specialCharCount > 5) {
        score += 10;
        reasons.push(`Special characters present (${features.specialCharCount})`);
    }
    if (features.subdomainCount > 3) {
        score += 15;
        reasons.push(`Excessive subdomains (${features.subdomainCount})`);
    }
    else if (features.subdomainCount > 1) {
        score += 7;
        reasons.push(`Multiple subdomains (${features.subdomainCount})`);
    }
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
    if (features.hasSuspiciousTLD) {
        score += 20;
        reasons.push('URL uses suspicious top-level domain');
    }
    if (features.hasShortener) {
        score += 10;
        reasons.push('URL uses a shortening service (hides destination)');
    }
    if (features.domainEntropy > 4.5) {
        score += 20;
        reasons.push(`High domain entropy (${features.domainEntropy.toFixed(2)}) - possibly randomly generated`);
    }
    else if (features.domainEntropy > 4.0) {
        score += 10;
        reasons.push(`Elevated domain entropy (${features.domainEntropy.toFixed(2)})`);
    }
    if (features.pathLength > 100) {
        score += 10;
        reasons.push(`Very long URL path (${features.pathLength} characters)`);
    }
    if (features.queryParamCount > 10) {
        score += 8;
        reasons.push(`Many query parameters (${features.queryParamCount})`);
    }
    score = Math.min(score, 100);
    if (reasons.length === 0) {
        reasons.push('No suspicious patterns detected');
    }
    return { score, reasons };
}
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
function analyzeURL(url, _includeFeatures) {
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
    const features = extractFeatures(url, parsed);
    const { score, reasons } = calculateRiskScore(features);
    const verdict = getVerdict(score);
    const result = {
        isValid: true,
        riskScore: score,
        verdict,
        reasons
    };
    if (_includeFeatures === true) {
        result.features = features;
    }
    return result;
}
function analyzeURLBatch(urls, _includeFeatures) {
    return urls.map(url => analyzeURL(url));
}
exports.default = {
    analyzeURL,
    analyzeURLBatch
};
//# sourceMappingURL=urlAnalyzer.js.map