function detectPhishing() {
  chrome.storage.sync.get(['pinSet', 'extensionEnabled', 'blockedUrls'], function(data) {
    console.log('Blocked URLs:', data.blockedUrls); // Debug log
    if (data.pinSet && data.extensionEnabled !== false) {
      const url = document.URL;
      console.log('Current URL:', url); // Debug log

      // Check if the URL is blocked
      if (data.blockedUrls && data.blockedUrls.some(blockedUrl => url.includes(blockedUrl))) {
        console.log('Blocked URL detected:', url); // Debug log
        displayBlockedError();
        return;
      }

      isPhishing(url).then(result => {
        if (result) {
          displayPhishingError();
        }
      });
    }
  });
}

async function isPhishing(url) {
  return false;
}

function displayPhishingError() {
  document.body.innerHTML = '<h1>Error: This site has been identified as a phishing site.</h1><p>Please be cautious when visiting unknown sites.</p>';
}

function displayBlockedError() {
  document.body.innerHTML = '<h1>Error: This site has been blocked.</h1><p>You cannot access this site as it is blocked by the extension.</p>';
}

detectPhishing();
