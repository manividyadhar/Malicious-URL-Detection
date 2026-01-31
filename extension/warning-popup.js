/**
 * Warning Popup Script
 * Handles the warning popup overlay that appears on risky pages
 */

// Get data from URL parameters or storage
const urlParams = new URLSearchParams(window.location.search);
const verdict = urlParams.get('verdict') || 'safe';
const riskScore = parseInt(urlParams.get('riskScore') || '0');
const url = urlParams.get('url') || window.location.href;
const reasons = JSON.parse(decodeURIComponent(urlParams.get('reasons') || '[]'));

// DOM elements
const header = document.getElementById('header');
const headerText = document.getElementById('headerText');
const riskScoreDiv = document.getElementById('riskScore');
const urlDisplay = document.getElementById('urlDisplay');
const reasonsList = document.getElementById('reasonsList');
const closeBtn = document.getElementById('closeBtn');
const proceedBtn = document.getElementById('proceedBtn');
const safeBtn = document.getElementById('safeBtn');

// Set content based on verdict
function setupWarning() {
  // Set header
  header.className = `warning-header ${verdict}`;
  riskScoreDiv.className = `risk-score ${verdict}`;
  
  // Set header text
  if (verdict === 'malicious') {
    headerText.textContent = '⚠️ MALICIOUS URL DETECTED';
    riskScoreDiv.textContent = `Risk Score: ${riskScore}/100`;
    proceedBtn.style.display = 'block';
    safeBtn.style.display = 'none';
  } else if (verdict === 'suspicious') {
    headerText.textContent = '⚠️ SUSPICIOUS URL DETECTED';
    riskScoreDiv.textContent = `Risk Score: ${riskScore}/100`;
    proceedBtn.style.display = 'block';
    safeBtn.style.display = 'none';
  } else {
    headerText.textContent = '✓ SAFE URL';
    riskScoreDiv.textContent = `Risk Score: ${riskScore}/100`;
    proceedBtn.style.display = 'none';
    safeBtn.style.display = 'block';
  }

  // Set URL
  urlDisplay.textContent = url;

  // Set reasons
  reasonsList.innerHTML = '';
  if (reasons.length > 0) {
    reasons.forEach(reason => {
      const li = document.createElement('li');
      li.textContent = reason;
      reasonsList.appendChild(li);
    });
  } else {
    const li = document.createElement('li');
    li.textContent = 'No specific issues detected';
    reasonsList.appendChild(li);
  }
}

// Event listeners
closeBtn.addEventListener('click', () => {
  window.close();
});

proceedBtn.addEventListener('click', () => {
  if (confirm('⚠️ WARNING: You are about to proceed to a risky website. Are you sure?')) {
    window.close();
  }
});

safeBtn.addEventListener('click', () => {
  window.close();
});

// Initialize
setupWarning();
