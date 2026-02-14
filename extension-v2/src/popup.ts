/**
 * Popup Script
 * 
 * Handles popup UI interactions and displays URL analysis results
 */

interface AnalysisResult {
    url: string;
    isValid: boolean;
    riskScore: number;
    verdict: 'safe' | 'suspicious' | 'malicious';
    reasons: string[];
    processingTimeMs?: number;
}

// DOM elements
const currentUrlEl = document.getElementById('currentUrl') as HTMLDivElement;
const checkButton = document.getElementById('checkButton') as HTMLButtonElement;
const loadingEl = document.getElementById('loading') as HTMLDivElement;
const errorEl = document.getElementById('error') as HTMLDivElement;
const resultEl = document.getElementById('result') as HTMLDivElement;

let currentTabId: number | undefined;
let currentUrl: string = '';

/**
 * Get verdict icon
 */
function getVerdictIcon(verdict: string): string {
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
 * Display result
 */
function displayResult(result: AnalysisResult) {
    const icon = getVerdictIcon(result.verdict);

    let html = `
    <div class="result ${result.verdict}">
      <div class="result-header">
        <span class="result-icon">${icon}</span>
        <span class="result-verdict">${result.verdict}</span>
      </div>
      <div class="result-score">
        Risk Score: <strong>${result.riskScore}/100</strong>
        ${result.processingTimeMs ? `• ${result.processingTimeMs}ms` : ''}
      </div>
  `;

    if (result.reasons && result.reasons.length > 0) {
        html += '<ul class="result-reasons">';
        result.reasons.forEach(reason => {
            html += `<li>${reason}</li>`;
        });
        html += '</ul>';
    }

    html += '</div>';

    resultEl.innerHTML = html;
    resultEl.style.display = 'block';
}

/**
 * Show error
 */
function showError(message: string) {
    errorEl.textContent = message;
    errorEl.style.display = 'block';
}

/**
 * Hide all states
 */
function hideAll() {
    loadingEl.style.display = 'none';
    errorEl.style.display = 'none';
    resultEl.style.display = 'none';
}

/**
 * Check URL
 */
async function checkURL() {
    if (!currentUrl) {
        showError('No URL to check');
        return;
    }

    hideAll();
    loadingEl.style.display = 'block';
    checkButton.disabled = true;

    try {
        // Send message to background script
        const response = await chrome.runtime.sendMessage({
            action: 'checkURL',
            url: currentUrl,
            tabId: currentTabId
        });

        hideAll();

        if (response.success) {
            displayResult(response.data);
        } else {
            showError(response.error || 'Failed to check URL');
        }
    } catch (error) {
        hideAll();
        showError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
        checkButton.disabled = false;
    }
}

/**
 * Initialize popup
 */
async function init() {
    try {
        // Get current tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (tab && tab.url) {
            currentUrl = tab.url;
            currentTabId = tab.id;
            currentUrlEl.textContent = currentUrl;
        } else {
            currentUrlEl.textContent = 'Unable to get current URL';
            checkButton.disabled = true;
        }
    } catch (error) {
        console.error('Error getting current tab:', error);
        currentUrlEl.textContent = 'Error loading URL';
        checkButton.disabled = true;
    }
}

// Event listeners
checkButton.addEventListener('click', checkURL);

// Initialize on load
init();
