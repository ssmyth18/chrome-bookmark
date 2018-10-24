chrome.runtime.onMessage.addListener(function(request, sender, callback) {
  if (request.name === 'getBookmarkList') {
    getBookmarkList(callback);
  }
  if (request.name === 'openPageOnNewTab') {
    openPageOnNewTab(request.href);
  }
  return true;
});

function openPageOnNewTab(href) {
  chrome.tabs.create({ url: href });
}

function getBookmarkList(callback) {
  chrome.bookmarks.getTree(nodes => callback(nodes));
}

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.sendMessage(tab.id, { name: 'switchDisplay' });
});
