chrome.commands.onCommand.addListener(function(command) {
  if (command === 'switch-display') {
    const param = {
      active: true,
      windowId: chrome.windows.WINDOW_ID_CURRENT
    };

    chrome.tabs.query(param, response => {
      const currentTab = response.shift();
      chrome.tabs.sendMessage(currentTab.id, {'name': 'switchDisplay'});
    });
  }
});

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
  chrome.tabs.create({url: href});
}

function getBookmarkList(callback) {
  chrome.bookmarks.getTree(function(nodes) {
    nodes.forEach(node => addFaviconSrc(node));
    callback(nodes);
  });
}

function addFaviconSrc(node) {
  if (node.url) {
    const image = new Image();
    image.src = `chrome://favicon/${node.url}`;
    const base64 = toBase64(image, 'image/x-icon');
    node.faviconSrc = base64;
  }
  if (node.children) {
    node.children.forEach(childNode => addFaviconSrc(childNode));
  }
}

function toBase64(image, mime_type) {
  var canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(image, 0, 0);
  return canvas.toDataURL(mime_type);
}
