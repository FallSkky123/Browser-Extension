// setPin.js

document.addEventListener('DOMContentLoaded', function() {
  const setPinButton = document.getElementById('setPinButton');
  const pinInput = document.getElementById('pin');
  const messageDiv = document.getElementById('message');

  setPinButton.addEventListener('click', function() {
    const pin = pinInput.value;
    if (isValidPin(pin)) {
      savePin(pin, function() {
        messageDiv.textContent = 'PIN set successfully!';
        setTimeout(function() {
          chrome.tabs.getCurrent(function(tab) {
            chrome.tabs.remove(tab.id);
          });
        }, 1000); // Menutup tab setelah 1 detik
      });
    } else {
      messageDiv.textContent = 'Please enter a valid 4-digit PIN.';
    }
  });

  function isValidPin(pin) {
    return pin.length === 4 && /^\d+$/.test(pin);
  }

  function savePin(pin, callback) {
    chrome.storage.sync.set({ pinSet: true, pin: pin }, function() {
      console.log('PIN set successfully:', pin);
      if (callback) {
        callback();
      }
    });
  }
});
