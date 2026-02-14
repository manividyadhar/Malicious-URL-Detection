#!/usr/bin/env node
/**
 * Malicious URL Detector - CLI Tool
 * 
 * Usage: node cli/index.js <url>
 * Example: node cli/index.js https://example.com
 */

import { analyzeURL } from '../shared/dist';

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    dim: '\x1b[2m',

    // Foreground colors
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    gray: '\x1b[90m',
};

/**
 * Get color based on verdict
 */
function getVerdictColor(verdict: string): string {
    switch (verdict) {
        case 'safe':
            return colors.green;
        case 'suspicious':
            return colors.yellow;
        case 'malicious':
            return colors.red;
        default:
            return colors.white;
    }
}

/**
 * Get emoji based on verdict
 */
function getVerdictEmoji(verdict: string): string {
    switch (verdict) {
        case 'safe':
            return '✅';
        case 'suspicious':
            return '⚠️';
        case 'malicious':
            return '🚨';
        default:
            return '❓';
    }
}

/**
 * Print formatted output
 */
function printResult(url: string, result: any): void {
    const verdictColor = getVerdictColor(result.verdict);
    const verdictEmoji = getVerdictEmoji(result.verdict);

    console.log('');
    console.log(`${colors.bright}${colors.cyan}🔍 URL Analysis${colors.reset}`);
    console.log(`${colors.gray}${'─'.repeat(60)}${colors.reset}`);
    console.log('');

    // URL
    console.log(`${colors.bright}URL:${colors.reset} ${colors.dim}${url}${colors.reset}`);
    console.log('');

    // Verdict
    console.log(`${colors.bright}Verdict:${colors.reset} ${verdictEmoji} ${verdictColor}${colors.bright}${result.verdict.toUpperCase()}${colors.reset}`);
    console.log('');

    // Risk Score
    const scoreColor = result.riskScore >= 70 ? colors.red :
        result.riskScore >= 30 ? colors.yellow :
            colors.green;
    console.log(`${colors.bright}Risk Score:${colors.reset} ${scoreColor}${result.riskScore}/100${colors.reset}`);
    console.log('');

    // Reasons
    if (result.reasons && result.reasons.length > 0) {
        console.log(`${colors.bright}Reasons:${colors.reset}`);
        result.reasons.forEach((reason: string) => {
            console.log(`  ${colors.dim}•${colors.reset} ${reason}`);
        });
        console.log('');
    }

    console.log(`${colors.gray}${'─'.repeat(60)}${colors.reset}`);
    console.log('');
}

/**
 * Print error message
 */
function printError(message: string): void {
    console.error('');
    console.error(`${colors.red}${colors.bright}❌ Error:${colors.reset} ${message}`);
    console.error('');
}

/**
 * Print usage information
 */
function printUsage(): void {
    console.log('');
    console.log(`${colors.bright}${colors.cyan}Malicious URL Detector - CLI${colors.reset}`);
    console.log('');
    console.log(`${colors.bright}Usage:${colors.reset}`);
    console.log(`  node cli/index.js ${colors.dim}<url>${colors.reset}`);
    console.log('');
    console.log(`${colors.bright}Examples:${colors.reset}`);
    console.log(`  node cli/index.js https://example.com`);
    console.log(`  node cli/index.js http://suspicious-site.tk`);
    console.log(`  npm run check:url https://example.com`);
    console.log('');
}

/**
 * Main function
 */
function main(): void {
    // Get URL from command line arguments
    const args = process.argv.slice(2);

    if (args.length === 0) {
        printUsage();
        process.exit(1);
    }

    const url = args[0];

    // Validate that argument looks like a URL
    if (!url || url.trim().length === 0) {
        printError('URL cannot be empty');
        printUsage();
        process.exit(1);
    }

    try {
        // Analyze URL
        const result = analyzeURL(url, false); // Don't include features for cleaner output

        // Print result
        printResult(url, result);
    } catch (error) {
        printError(error instanceof Error ? error.message : 'Unknown error occurred');
        process.exit(1);
    }
}

// Run main function
main();
