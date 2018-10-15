chrome.runtime.onMessage.addListener(function(request, sender, callback) {
  if (request === 'getBookmarks') {
    chrome.bookmarks.getTree(function(nodes) {
      callback(nodes);
    });
  }
  return true;
});
