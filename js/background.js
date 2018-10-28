chrome.runtime.onMessage.addListener(function(request, sender, callback) {
  if (request.name === 'getBookmarkList') {
    getBookmarkList(callback);
  }
  if (request.name === 'openPageOnNewTab') {
    openPageOnNewTab(request.href);
  }
  if (request.name === 'openPageOnCurrentTab') {
    openPageOnCurrentTab(request.href);
  }
  if (request.name === 'switchIframe') {
    switchIframe(request);
  }
  return true;
});

function openPageOnNewTab(href) {
  chrome.tabs.create({ url: href });
}

function openPageOnCurrentTab(href) {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs =>
    chrome.tabs.update(tabs[0].id, { url: href })
  );
}

function switchIframe(request) {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs =>
    chrome.tabs.sendMessage(tabs[0].id, request)
  );
}

function getBookmarkList(callback) {
  chrome.bookmarks.getTree(nodes => callback(nodes));
}

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.sendMessage(tab.id, { name: 'switchDisplay' });
});
