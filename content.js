// content.js
function detectPhishing() {
  chrome.storage.sync.get(['pinSet', 'extensionEnabled'], function(data) {
    if (data.pinSet && data.extensionEnabled !== false) {
      const url = document.URL;
      isPhishing(url).then(result => {
        if (result) {
          displayPhishingError();
        }
      });
    }
  });
}

async function isPhishing(url) {
  try {
    const response = await fetch(chrome.runtime.getURL('phishingUrls.json'));
    const data = await response.json();
    const phishingUrls = data.phishingUrls;
    return phishingUrls.includes(url);
  } catch (error) {
    console.error('Failed to load phishingUrls.json:', error);
    return false;
  }
}

function displayPhishingError() {
  document.body.innerHTML = '<h1>Error: This site has been identified as a phishing site.</h1><p>Please be cautious when visiting unknown sites.</p>';
}

detectPhishing();
