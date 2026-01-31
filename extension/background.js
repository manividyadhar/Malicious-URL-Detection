/**
 * Background Service Worker for Malicious URL Detector
 * 
 * Handles:
 * - URL scanning requests
 * - Communication with backend API
 * - Tab updates monitoring
 */

// Configuration
// Use 127.0.0.1 as primary (more reliable for extensions)
const API_BASE_URLS = [
  'http://127.0.0.1:8000',
  'http://localhost:8000'
];
let CURRENT_API_URL = API_BASE_URLS[0]; // Start with 127.0.0.1
let BACKEND_AVAILABLE = false; // Track backend availability

// Track currently scanning tabs to avoid duplicate scans
const scanningTabs = new Set();

// Service worker keep-alive: Prevent service worker from being terminated
// This ensures fetch requests can complete
let keepAliveInterval = null;

// Cache for recent scans to avoid redundant API calls
const scanCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Request timeout (10 seconds)
const REQUEST_TIMEOUT = 10000;

/**
 * Create an AbortController with timeout
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {AbortController} Controller with timeout signal
 */
function createTimeoutController(timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  // Clear timeout if request completes (handled in fetch)
  return { controller, timeoutId };
}

/**
 * Scan a URL using the backend API with retry logic
 * @param {string} url - URL to scan
 * @param {number} retryCount - Current retry attempt (internal use)
 * @returns {Promise<Object>} Scan result
 */
async function scanURL(url, retryCount = 0) {
  // Validate input
  if (!url || typeof url !== 'string' || url.trim() === '') {
    throw new Error('Invalid URL: URL is required and must be a non-empty string');
  }

  // Check cache first
  const cached = scanCache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('📦 Using cached result for:', url);
    return cached.data;
  }

  // If backend was previously unavailable, check again
  if (!BACKEND_AVAILABLE) {
    console.log('🔄 Backend was unavailable, checking health again...');
    BACKEND_AVAILABLE = await checkBackendHealth();
  }

  const maxRetries = API_BASE_URLS.length;
  let lastError = null;

  // Try each API URL (localhost, then 127.0.0.1)
  for (let i = 0; i < API_BASE_URLS.length; i++) {
    const apiUrl = API_BASE_URLS[i];
    console.log(`🔍 Attempting to connect to: ${apiUrl}`);
    
    try {
      const { controller, timeoutId } = createTimeoutController(REQUEST_TIMEOUT);
      
      // Manifest V3 Service Worker fetch configuration
      // CRITICAL: Use proper fetch options for service workers
      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ url: url }),
        signal: controller.signal,
        // Service worker fetch requirements:
        credentials: 'omit',  // Don't send cookies (matches backend CORS)
        mode: 'cors',         // Explicit CORS mode
        cache: 'no-cache',    // Don't cache API requests
        redirect: 'follow',   // Follow redirects
      };

      console.log(`📤 Sending POST to ${apiUrl}/scan-url`);
      console.log(`   Body:`, JSON.stringify({ url: url.substring(0, 50) + '...' }));
      
      const response = await fetch(`${apiUrl}/scan-url`, fetchOptions);

      clearTimeout(timeoutId); // Clear timeout on success

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      
      // Success! Update current API URL and cache result
      CURRENT_API_URL = apiUrl;
      console.log(`✅ Successfully connected to: ${apiUrl}`);
      
      scanCache.set(url, {
        data: data,
        timestamp: Date.now()
      });

      return data;
      
    } catch (error) {
      lastError = error;
      
      // Log detailed error information
      if (error.name === 'AbortError') {
        console.error(`⏱️ Request timeout for ${apiUrl} (${REQUEST_TIMEOUT}ms)`);
      } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
        console.error(`🌐 Network error connecting to ${apiUrl}:`, error.message);
        console.error('   Possible causes:');
        console.error('   - Backend server not running');
        console.error('   - Firewall blocking connection');
        console.error('   - CORS configuration issue');
      } else {
        console.error(`❌ Error with ${apiUrl}:`, error.message);
      }
      
      // Try next URL if available
      if (i < API_BASE_URLS.length - 1) {
        console.log(`🔄 Retrying with next URL...`);
        continue;
      }
    }
  }

  // All URLs failed
  const errorMessage = lastError?.message || 'Unknown error';
  console.error('❌ All API connection attempts failed');
  console.error('💡 Troubleshooting steps:');
  console.error('   1. Verify backend is running: python main.py');
  console.error('   2. Test in browser: http://localhost:8000/health');
  console.error('   3. Check firewall/antivirus settings');
  console.error('   4. Verify CORS configuration in backend');
  
  throw new Error(`Failed to connect to backend API: ${errorMessage}`);
}

/**
 * Get the current active tab URL
 * @returns {Promise<string>} Current tab URL
 */
async function getCurrentTabURL() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tabs.length > 0) {
    return tabs[0].url;
  }
  return null;
}

// Listen for messages from popup or content scripts
// CRITICAL: In Manifest V3, we must return true AND handle async properly
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Handle scanURL request
  if (request.action === 'scanURL') {
    // Use async IIFE to properly handle async operations
    (async () => {
      try {
        const result = await scanURL(request.url);
        sendResponse({ success: true, data: result });
      } catch (error) {
        console.error('Error in scanURL handler:', error);
        sendResponse({ 
          success: false, 
          error: error.message || 'Unknown error',
          details: error.toString()
        });
      }
    })();
    return true; // Indicates we will send a response asynchronously
  }

  // Handle getCurrentURL request
  if (request.action === 'getCurrentURL') {
    (async () => {
      try {
        const url = await getCurrentTabURL();
        sendResponse({ success: true, url: url });
      } catch (error) {
        console.error('Error in getCurrentURL handler:', error);
        sendResponse({ success: false, error: error.message });
      }
    })();
    return true;
  }

  // Handle getCurrentTabId request - get current tab ID
  if (request.action === 'getCurrentTabId') {
    (async () => {
      try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs.length > 0) {
          sendResponse({ success: true, tabId: tabs[0].id });
        } else {
          sendResponse({ success: false, error: 'No active tab found' });
        }
      } catch (error) {
        console.error('Error in getCurrentTabId handler:', error);
        sendResponse({ success: false, error: error.message });
      }
    })();
    return true;
  }

  // Handle getScanResult request - get cached scan result for current tab
  if (request.action === 'getScanResult') {
    (async () => {
      try {
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tabs.length > 0) {
          const tabId = tabs[0].id;
          const stored = await chrome.storage.local.get([`scan_result_${tabId}`]);
          const scanResult = stored[`scan_result_${tabId}`];
          
          if (scanResult) {
            sendResponse({ success: true, data: scanResult });
          } else {
            // No cached result, trigger scan
            const url = tabs[0].url;
            if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
              const result = await scanURL(url);
              await chrome.storage.local.set({
                [`scan_result_${tabId}`]: {
                  url: url,
                  risk_score: result.risk_score,
                  verdict: result.verdict,
                  reasons: result.reasons,
                  timestamp: Date.now()
                }
              });
              sendResponse({ success: true, data: {
                url: url,
                risk_score: result.risk_score,
                verdict: result.verdict,
                reasons: result.reasons,
                timestamp: Date.now()
              }});
            } else {
              sendResponse({ success: false, error: 'Not a valid HTTP/HTTPS URL' });
            }
          }
        } else {
          sendResponse({ success: false, error: 'No active tab found' });
        }
      } catch (error) {
        console.error('Error in getScanResult handler:', error);
        sendResponse({ success: false, error: error.message });
      }
    })();
    return true;
  }

  // Return false if message not handled
  return false;
});

/**
 * Automatically scan URL and show warning if needed
 * @param {number} tabId - Tab ID
 * @param {string} url - URL to scan
 */
async function autoScanTab(tabId, url) {
  // Skip if already scanning this tab
  if (scanningTabs.has(tabId)) {
    return;
  }

  // Skip chrome://, chrome-extension://, and other internal URLs
  if (!url || url.startsWith('chrome://') || url.startsWith('chrome-extension://') || 
      url.startsWith('edge://') || url.startsWith('about:') || url.startsWith('moz-extension://')) {
    return;
  }

  // Skip if not http/https
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return;
  }

  scanningTabs.add(tabId);

  try {
    console.log(`🔍 Auto-scanning tab ${tabId}: ${url.substring(0, 50)}...`);
    const result = await scanURL(url);
    
    // Store result for popup to display
    await chrome.storage.local.set({
      [`scan_result_${tabId}`]: {
        url: url,
        risk_score: result.risk_score,
        verdict: result.verdict,
        reasons: result.reasons,
        timestamp: Date.now()
      }
    });

    // Update extension badge based on risk
    updateBadge(tabId, result.verdict, result.risk_score);
    
    // Show notification and popup for suspicious/malicious URLs
    if (result.verdict === 'malicious' || 
        (result.verdict === 'suspicious' && result.risk_score >= 60)) {
      
      // Show browser notification
      try {
        await chrome.notifications.create({
          type: 'basic',
          title: `⚠️ ${result.verdict.toUpperCase()} URL Detected`,
          message: `Risk Score: ${result.risk_score}/100\n${result.reasons[0] || 'Suspicious patterns detected'}`,
          priority: result.verdict === 'malicious' ? 2 : 1
        });
      } catch (notifError) {
        // Notifications permission might not be granted
        console.warn('Could not show notification:', notifError);
      }

      // Show popup overlay on the page
      try {
        // Send message to content script to show popup
        chrome.tabs.sendMessage(tabId, {
          action: 'showWarning',
          data: {
            url: url,
            risk_score: result.risk_score,
            verdict: result.verdict,
            reasons: result.reasons
          }
        }).catch(err => {
          // Content script might not be ready yet, retry after a delay
          setTimeout(() => {
            chrome.tabs.sendMessage(tabId, {
              action: 'showWarning',
              data: {
                url: url,
                risk_score: result.risk_score,
                verdict: result.verdict,
                reasons: result.reasons
              }
            }).catch(() => {
              console.warn('Could not send message to content script');
            });
          }, 1000);
        });
      } catch (popupError) {
        console.warn('Could not show popup:', popupError);
      }
    }

    console.log(`✅ Auto-scan complete for tab ${tabId}: ${result.verdict} (${result.risk_score}/100)`);
  } catch (error) {
    console.error(`❌ Auto-scan failed for tab ${tabId}:`, error.message);
    // Don't show error to user - silent fail
  } finally {
    scanningTabs.delete(tabId);
  }
}

/**
 * Update extension badge color and text based on risk
 * @param {number} tabId - Tab ID
 * @param {string} verdict - Verdict (safe/suspicious/malicious)
 * @param {number} riskScore - Risk score
 */
function updateBadge(tabId, verdict, riskScore) {
  const colors = {
    'safe': '#28a745',      // Green
    'suspicious': '#ffc107', // Yellow
    'malicious': '#dc3545'   // Red
  };

  const texts = {
    'safe': '✓',
    'suspicious': '!',
    'malicious': '⚠'
  };

  chrome.action.setBadgeText({
    text: texts[verdict] || '',
    tabId: tabId
  });

  chrome.action.setBadgeBackgroundColor({
    color: colors[verdict] || '#667eea',
    tabId: tabId
  });
}

// Monitor tab updates - automatically scan when page loads
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Only scan when page is fully loaded
  if (changeInfo.status === 'complete' && tab.url) {
    await autoScanTab(tabId, tab.url);
  }
});

// Monitor tab activation - scan when user switches tabs
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  try {
    const tab = await chrome.tabs.get(activeInfo.tabId);
    if (tab.url) {
      // Check if we already have a recent scan result
      const stored = await chrome.storage.local.get([`scan_result_${activeInfo.tabId}`]);
      const scanResult = stored[`scan_result_${activeInfo.tabId}`];
      
      // If no result or result is older than 1 minute, scan again
      if (!scanResult || (Date.now() - scanResult.timestamp > 60000)) {
        await autoScanTab(activeInfo.tabId, tab.url);
      } else {
        // Use cached result to update badge
        updateBadge(activeInfo.tabId, scanResult.verdict, scanResult.risk_score);
      }
    }
  } catch (error) {
    console.error('Error in tab activation handler:', error);
  }
});

// Initialize service worker and keep it alive
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('🔧 Extension installed/updated:', details.reason);
  await initializeServiceWorker();
});

chrome.runtime.onStartup.addListener(async () => {
  console.log('🚀 Extension startup');
  await initializeServiceWorker();
});

/**
 * Initialize service worker and check backend connectivity
 */
async function initializeServiceWorker() {
  // Start keep-alive mechanism
  startKeepAlive();
  
  // Check backend health
  const isHealthy = await checkBackendHealth();
  BACKEND_AVAILABLE = isHealthy;
  
  if (isHealthy) {
    console.log('✅ Service worker initialized and backend is available');
  } else {
    console.warn('⚠️ Service worker initialized but backend is not available');
  }
}

/**
 * Keep service worker alive to prevent termination
 * Service workers can be terminated by Chrome, causing fetch to fail
 */
function startKeepAlive() {
  // Clear existing interval if any
  if (keepAliveInterval) {
    clearInterval(keepAliveInterval);
  }
  
  // Ping every 20 seconds to keep service worker alive
  keepAliveInterval = setInterval(() => {
    // Simple operation to keep service worker active
    chrome.storage.local.get(['keepAlive'], () => {
      // Service worker is alive
    });
  }, 20000);
  
  console.log('💓 Keep-alive mechanism started');
}

/**
 * Check if backend API is accessible (tries both localhost and 127.0.0.1)
 * @returns {Promise<boolean>} True if backend is reachable
 */
async function checkBackendHealth() {
  for (const apiUrl of API_BASE_URLS) {
    try {
      console.log(`🏥 Health check: ${apiUrl}/health`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${apiUrl}/health`, {
        method: 'GET',
        signal: controller.signal,
        credentials: 'omit',
        mode: 'cors',
        cache: 'no-cache',
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        console.log(`✅ Backend API is healthy at ${apiUrl}`);
        console.log(`   Status: ${data.status || 'unknown'}`);
        CURRENT_API_URL = apiUrl;
        BACKEND_AVAILABLE = true;
        return true;
      } else {
        console.warn(`⚠️ Health check failed for ${apiUrl}: HTTP ${response.status}`);
        const errorText = await response.text().catch(() => '');
        console.warn(`   Response: ${errorText.substring(0, 100)}`);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error(`⏱️ Health check timeout for ${apiUrl}`);
      } else {
        console.error(`❌ Cannot connect to ${apiUrl}:`, error.message);
      }
    }
  }
  
  // All health checks failed
  BACKEND_AVAILABLE = false;
  console.error('❌ Cannot connect to backend API on any URL');
  console.error('💡 Make sure the backend server is running:');
  console.error('   1. Open terminal');
  console.error('   2. cd backend');
  console.error('   3. python main.py');
  console.error('   4. Verify in browser: http://localhost:8000/health');
  console.error('   5. Check firewall/antivirus settings');
  console.error('   6. Check if port 8000 is available: netstat -ano | findstr :8000');
  return false;
}
