// background.js

// Memeriksa saat instalasi pertama
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.get(['pinSet'], function(data) {
    if (!data.pinSet) {
      chrome.tabs.create({ url: chrome.runtime.getURL('setPin.html') });
    }
  });
});

// Memeriksa saat ekstensi startup
chrome.runtime.onStartup.addListener(function() {
  chrome.storage.sync.get(['pinSet'], function(data) {
    if (!data.pinSet) {
      chrome.tabs.create({ url: chrome.runtime.getURL('setPin.html') });
    }
  });
});

// Fungsi untuk menyimpan PIN ke storage
function savePin(pin) {
  chrome.storage.sync.set({ pinSet: true, pin: pin });
}
