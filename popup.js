document.addEventListener('DOMContentLoaded', init);

function init() {
  const disableButton = document.getElementById('disableButton');
  const disablePinInput = document.getElementById('disablePinInput');
  const enableButton = document.getElementById('enableButton');
  const enablePinInput = document.getElementById('enablePinInput');
  const blockUrlButton = document.getElementById('blockUrlButton');
  const unblockUrlButton = document.getElementById('unblockUrlButton');
  const blockUrlInput = document.getElementById('blockUrlInput');
  const unblockUrlInput = document.getElementById('unblockUrlInput');
  const searchUrlButton = document.getElementById('searchUrlButton');
  const searchUrlInput = document.getElementById('searchUrlInput');
  const resultDiv = document.getElementById('result');
  const searchResultDiv = document.getElementById('searchResult');

  disableButton.addEventListener('click', () => handleDisableExtension(disablePinInput, resultDiv));
  enableButton.addEventListener('click', () => handleEnableExtension(enablePinInput, resultDiv));
  blockUrlButton.addEventListener('click', () => handleBlockUrl(blockUrlInput, resultDiv));
  unblockUrlButton.addEventListener('click', () => handleUnblockUrl(unblockUrlInput, resultDiv));
  searchUrlButton.addEventListener('click', () => handleSearchUrl(searchUrlInput, searchResultDiv));
}

function handleDisableExtension(disablePinInput, resultDiv) {
  const pin = disablePinInput.value;
  checkExtensionAllowed(pin, function(allowed) {
    if (allowed) {
      chrome.runtime.connect({ name: 'disableExtensionPort' });
      chrome.storage.sync.set({ extensionEnabled: false });
      resultDiv.textContent = 'Extension disabled successfully.';
    } else {
      resultDiv.textContent = 'Incorrect PIN.';
    }
  });
}

function handleEnableExtension(enablePinInput, resultDiv) {
  const pin = enablePinInput.value;
  checkExtensionAllowed(pin, function(allowed) {
    if (allowed) {
      chrome.storage.sync.set({ extensionEnabled: true });
      resultDiv.textContent = 'Extension enabled successfully.';
    } else {
      resultDiv.textContent = 'Incorrect PIN.';
    }
  });
}

function handleBlockUrl(blockUrlInput, resultDiv) {
  const urlToBlock = blockUrlInput.value.trim();
  if (urlToBlock) {
    chrome.storage.sync.get(['blockedUrls'], function(data) {
      const blockedUrls = data.blockedUrls || [];
      if (!blockedUrls.includes(urlToBlock)) {
        blockedUrls.push(urlToBlock);
        chrome.storage.sync.set({ blockedUrls: blockedUrls }, function() {
          console.log('Blocked URLs:', blockedUrls); // Debug log
          resultDiv.textContent = 'URL blocked successfully.';
        });
      } else {
        resultDiv.textContent = 'URL is already blocked.';
      }
    });
  } else {
    resultDiv.textContent = 'Please enter a valid URL.';
  }
}

function handleUnblockUrl(unblockUrlInput, resultDiv) {
  const urlToUnblock = unblockUrlInput.value.trim();
  if (urlToUnblock) {
    chrome.storage.sync.get(['blockedUrls'], function(data) {
      const blockedUrls = data.blockedUrls || [];
      const index = blockedUrls.indexOf(urlToUnblock);
      if (index > -1) {
        blockedUrls.splice(index, 1);
        chrome.storage.sync.set({ blockedUrls: blockedUrls }, function() {
          console.log('Blocked URLs:', blockedUrls); // Debug log
          resultDiv.textContent = 'URL unblocked successfully.';
        });
      } else {
        resultDiv.textContent = 'URL is not blocked.';
      }
    });
  } else {
    resultDiv.textContent = 'Please enter a valid URL.';
  }
}

function handleSearchUrl(searchUrlInput, searchResultDiv) {
  const urlToCheck = searchUrlInput.value.trim();
  if (urlToCheck) {
    checkUrlWithVirusTotal(urlToCheck, function(result) {
      searchResultDiv.textContent = result ? 'URL is malicious or suspicious.' : 'URL is safe.';
    });
  } else {
    searchResultDiv.textContent = 'Please enter a valid URL.';
  }
}

function checkExtensionAllowed(pin, callback) {
  chrome.storage.sync.get(['pin'], function(data) {
    const storedPin = data.pin;
    callback(pin === storedPin);
  });
}

function checkUrlWithVirusTotal(url, callback) {
  const apiKey = 'b3194df60444e1ca5ec2900641a3acc0798592d3cae453c3c68edc8f3f78d62a';
  fetch(`https://www.virustotal.com/api/v3/urls/${btoa(url)}`, {
    headers: {
      'x-apikey': apiKey
    }
  })
  .then(response => response.json())
  .then(data => {
    const isMalicious = data.data.attributes.last_analysis_stats.malicious > 0;
    callback(isMalicious);
  })
  .catch(error => {
    console.error('Error checking URL with VirusTotal:', error);
    callback(false);
  });
}
