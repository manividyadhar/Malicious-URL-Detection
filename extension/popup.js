/**
 * Popup Script for Malicious URL Detector Extension
 * 
 * Handles UI interactions and displays scan results
 */

// DOM elements
const urlInput = document.getElementById('urlInput');
const scanBtn = document.getElementById('scanBtn');
const currentBtn = document.getElementById('currentBtn');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const resultDiv = document.getElementById('result');
const verdictDiv = document.getElementById('verdict');
const riskScoreDiv = document.getElementById('riskScore');
const reasonsList = document.getElementById('reasonsList');
const infoDiv = document.getElementById('info');

/**
 * Show loading state
 */
function showLoading() {
  loadingDiv.style.display = 'block';
  errorDiv.classList.remove('show');
  resultDiv.classList.remove('show');
  scanBtn.disabled = true;
  currentBtn.disabled = true;
}

/**
 * Hide loading state
 */
function hideLoading() {
  loadingDiv.style.display = 'none';
  scanBtn.disabled = false;
  currentBtn.disabled = false;
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
  errorDiv.textContent = `Error: ${message}`;
  errorDiv.classList.add('show');
  resultDiv.classList.remove('show');
}

/**
 * Display scan results
 * @param {Object} data - Scan result data from API
 */
function displayResults(data) {
  hideLoading();
  errorDiv.classList.remove('show');
  
  // Set verdict
  verdictDiv.textContent = `Verdict: ${data.verdict.toUpperCase()}`;
  verdictDiv.className = `verdict ${data.verdict}`;
  
  // Set risk score
  riskScoreDiv.textContent = `Risk Score: ${data.risk_score}/100`;
  
  // Set risk score color based on value
  if (data.risk_score < 30) {
    riskScoreDiv.style.color = '#28a745';
  } else if (data.risk_score < 70) {
    riskScoreDiv.style.color = '#ffc107';
  } else {
    riskScoreDiv.style.color = '#dc3545';
  }
  
  // Display reasons
  reasonsList.innerHTML = '';
  data.reasons.forEach(reason => {
    const li = document.createElement('li');
    li.textContent = reason;
    reasonsList.appendChild(li);
  });
  
  // Display additional info
  let infoText = `Processing time: ${data.processing_time_ms}ms`;
  if (data.ml_confidence !== null) {
    infoText += ` | ML Confidence: ${(data.ml_confidence * 100).toFixed(1)}%`;
  }
  infoDiv.textContent = infoText;
  
  // Show result section
  resultDiv.classList.add('show');
}

/**
 * Scan a URL
 * @param {string} url - URL to scan
 */
async function scanURL(url) {
  if (!url || url.trim() === '') {
    showError('Please enter a valid URL');
    return;
  }

  showLoading();

  try {
    // Send message to background script
    chrome.runtime.sendMessage(
      { action: 'scanURL', url: url },
      (response) => {
        if (chrome.runtime.lastError) {
          showError(chrome.runtime.lastError.message);
          return;
        }

        if (!response) {
          showError('No response from extension. Make sure the backend server is running at http://localhost:8000');
          return;
        }

        if (response.success) {
          displayResults(response.data);
        } else {
          const errorMsg = response.error || 'Failed to scan URL';
          if (errorMsg.includes('Failed to fetch') || errorMsg.includes('fetch')) {
            showError('Cannot connect to backend API. Please:\n1. Start the backend: cd backend && python main.py\n2. Verify: http://localhost:8000/health\n3. Reload this extension');
          } else {
            showError(errorMsg);
          }
        }
      }
    );
  } catch (error) {
    showError(error.message);
  }
}

/**
 * Get and scan current tab URL
 */
async function scanCurrentURL() {
  showLoading();

  try {
    chrome.runtime.sendMessage(
      { action: 'getCurrentURL' },
      (response) => {
        if (chrome.runtime.lastError) {
          showError(chrome.runtime.lastError.message);
          return;
        }

        if (response.success && response.url) {
          urlInput.value = response.url;
          scanURL(response.url);
        } else {
          showError('Could not get current page URL');
        }
      }
    );
  } catch (error) {
    showError(error.message);
  }
}

// Event listeners
scanBtn.addEventListener('click', () => {
  const url = urlInput.value.trim();
  scanURL(url);
});

currentBtn.addEventListener('click', () => {
  scanCurrentURL();
});

urlInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    scanBtn.click();
  }
});

/**
 * Load and display current tab's scan result automatically
 */
async function loadCurrentTabResult() {
  showLoading();
  
  try {
    chrome.runtime.sendMessage(
      { action: 'getScanResult' },
      (response) => {
        if (chrome.runtime.lastError) {
          hideLoading();
          showError(chrome.runtime.lastError.message);
          return;
        }

        if (!response) {
          hideLoading();
          showError('No response from extension. Make sure the backend server is running at http://127.0.0.1:8000');
          return;
        }

        if (response.success && response.data) {
          // Display the cached scan result
          displayResults(response.data);
          
          // Also update the URL input
          if (response.data.url) {
            urlInput.value = response.data.url;
          }
        } else {
          hideLoading();
          const errorMsg = response.error || 'No scan result available';
          if (errorMsg.includes('Not a valid')) {
            // This is normal for chrome:// pages
            errorDiv.textContent = 'Current page cannot be scanned (internal browser page)';
            errorDiv.classList.add('show');
          } else {
            showError(errorMsg);
          }
        }
      }
    );
  } catch (error) {
    hideLoading();
    showError(error.message);
  }
}

// Auto-load current tab's scan result when popup opens
window.addEventListener('DOMContentLoaded', () => {
  // Automatically load and display current tab's scan result
  loadCurrentTabResult();
});
