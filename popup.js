// popup.js

document.addEventListener('DOMContentLoaded', init);

function init() {
  const disableButton = document.getElementById('disableButton');
  const disablePinInput = document.getElementById('disablePinInput');
  const enableButton = document.getElementById('enableButton');
  const enablePinInput = document.getElementById('enablePinInput');
  const resultDiv = document.getElementById('result');

  disableButton.addEventListener('click', () => handleDisableExtension(disablePinInput, resultDiv));
  enableButton.addEventListener('click', () => handleEnableExtension(enablePinInput, resultDiv));
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

function checkExtensionAllowed(pin, callback) {
  chrome.storage.sync.get(['pin'], function(data) {
    const storedPin = data.pin;
    callback(pin === storedPin);
  });
}
