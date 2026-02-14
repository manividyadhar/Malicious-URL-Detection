/**
 * Background Service Worker
 * 
 * Handles badge updates based on URL analysis results
 */

// API endpoint
const API_URL = 'https://malicious-url-detection-cmxm.onrender.com/api/check-url';

/**
 * Update extension badge based on verdict
 */
function updateBadge(tabId: number, verdict: 'safe' | 'suspicious' | 'malicious') {
    const badgeConfig = {
        safe: { color: '#10b981', text: '✓' },
        suspicious: { color: '#f59e0b', text: '!' },
        malicious: { color: '#ef4444', text: '✗' }
    };

    const config = badgeConfig[verdict];

    chrome.action.setBadgeBackgroundColor({ color: config.color, tabId });
    chrome.action.setBadgeText({ text: config.text, tabId });
}

/**
 * Clear badge
 */
function clearBadge(tabId: number) {
    chrome.action.setBadgeText({ text: '', tabId });
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'checkURL') {
        const { url, tabId } = message;

        // Check URL via API
        fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        })
            .then(response => response.json())
            .then(data => {
                // Update badge
                if (tabId) {
                    updateBadge(tabId, data.verdict);
                }

                // Send response back to popup
                sendResponse({ success: true, data });
            })
            .catch(error => {
                console.error('Error checking URL:', error);
                sendResponse({ success: false, error: error.message });
            });

        // Return true to indicate async response
        return true;
    }

    if (message.action === 'clearBadge') {
        if (message.tabId) {
            clearBadge(message.tabId);
        }
    }
});

// Clear badge when tab is updated
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        clearBadge(tabId);
    }
});

console.log('Malicious URL Detector extension loaded');
