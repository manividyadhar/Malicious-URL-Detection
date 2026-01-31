/**
 * Content Script for Malicious URL Detector
 * 
 * Injects warning popup overlay when risky URL is detected
 */

// Track if popup is already shown to avoid duplicates
let popupShown = false;

/**
 * Show warning popup overlay on the page
 * @param {Object} scanResult - Scan result data
 */
function showWarningPopup(scanResult) {
  // Prevent duplicate popups
  if (popupShown) {
    return;
  }

  // Skip if safe
  if (scanResult.verdict === 'safe' && scanResult.risk_score < 30) {
    return;
  }

  popupShown = true;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'url-detector-warning-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    z-index: 999999;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.3s ease-out;
  `;

  // Create popup container
  const popup = document.createElement('div');
  popup.style.cssText = `
    background: white;
    border-radius: 12px;
    max-width: 500px;
    width: 90%;
    max-height: 80vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    animation: slideDown 0.3s ease-out;
  `;

  // Set colors based on verdict
  const colors = {
    safe: { bg: '#d4edda', text: '#155724', border: '#28a745' },
    suspicious: { bg: '#fff3cd', text: '#856404', border: '#ffc107' },
    malicious: { bg: '#f8d7da', text: '#721c24', border: '#dc3545' }
  };

  const color = colors[scanResult.verdict] || colors.safe;

  // Popup content
  popup.innerHTML = `
    <div style="padding: 20px; background: ${color.bg}; color: ${color.text}; text-align: center; font-weight: bold; font-size: 18px; border-top-left-radius: 12px; border-top-right-radius: 12px;">
      ${scanResult.verdict === 'malicious' ? '⚠️ MALICIOUS URL DETECTED' : 
        scanResult.verdict === 'suspicious' ? '⚠️ SUSPICIOUS URL DETECTED' : 
        '✓ SAFE URL'}
    </div>
    <div style="padding: 20px;">
      <div style="text-align: center; font-size: 32px; font-weight: bold; color: ${color.border}; margin: 15px 0;">
        Risk Score: ${scanResult.risk_score}/100
      </div>
      <div style="background: #f8f9fa; padding: 10px; border-radius: 6px; margin: 15px 0; word-break: break-all; font-size: 12px; color: #666;">
        ${scanResult.url}
      </div>
      <div style="margin: 15px 0;">
        <h3 style="font-size: 14px; margin-bottom: 10px; color: #333;">Analysis Details:</h3>
        <ul style="list-style: none; padding-left: 0;">
          ${scanResult.reasons.map(reason => `
            <li style="padding: 8px; margin-bottom: 5px; background: #f8f9fa; border-left: 3px solid ${color.border}; border-radius: 4px; font-size: 13px;">
              ${reason}
            </li>
          `).join('')}
        </ul>
      </div>
      <div style="display: flex; gap: 10px; margin-top: 20px;">
        <button id="close-warning-btn" style="flex: 1; padding: 12px; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; background: #6c757d; color: white;">
          Close
        </button>
        ${scanResult.verdict !== 'safe' ? `
          <button id="proceed-warning-btn" style="flex: 1; padding: 12px; border: none; border-radius: 6px; font-size: 14px; font-weight: 600; cursor: pointer; background: #dc3545; color: white;">
            Proceed Anyway
          </button>
        ` : ''}
      </div>
    </div>
  `;

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  // Add CSS animations
  if (!document.getElementById('url-detector-styles')) {
    const style = document.createElement('style');
    style.id = 'url-detector-styles';
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideDown {
        from {
          transform: translateY(-20px);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }

  // Event listeners
  document.getElementById('close-warning-btn').addEventListener('click', () => {
    overlay.remove();
    popupShown = false;
  });

  if (scanResult.verdict !== 'safe') {
    document.getElementById('proceed-warning-btn').addEventListener('click', () => {
      if (confirm('⚠️ WARNING: You are about to proceed to a risky website. Are you sure?')) {
        overlay.remove();
        popupShown = false;
      }
    });
  }

  // Close on overlay click (outside popup)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.remove();
      popupShown = false;
    }
  });
}

// Listen for scan results from background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'showWarning') {
    showWarningPopup(request.data);
    sendResponse({ success: true });
  }
  return true;
});

// Check for existing scan result when page loads
(async () => {
  try {
    // Get current tab ID by querying tabs
    chrome.runtime.sendMessage({ action: 'getCurrentTabId' }, (response) => {
      if (response && response.success && response.tabId) {
        // Get scan result from storage
        chrome.storage.local.get([`scan_result_${response.tabId}`], (result) => {
          const scanResult = result[`scan_result_${response.tabId}`];
          if (scanResult && (scanResult.verdict === 'malicious' || 
              (scanResult.verdict === 'suspicious' && scanResult.risk_score >= 60))) {
            // Show popup if risky
            setTimeout(() => {
              showWarningPopup(scanResult);
            }, 1000); // Small delay to ensure page is loaded
          }
        });
      }
    });
  } catch (error) {
    console.error('Error checking scan result:', error);
  }
})(); // Use capture phase
