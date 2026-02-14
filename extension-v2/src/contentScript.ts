/**
 * Content Script
 * 
 * Currently minimal - can be extended for page-level features
 */

console.log('Malicious URL Detector content script loaded');

// Listen for messages from background or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'getPageInfo') {
        // Can be used to extract page information if needed
        sendResponse({
            url: window.location.href,
            title: document.title
        });
    }
});
