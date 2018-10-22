chrome.runtime.onMessage.addListener(function(request, sender, callback) {
  if (request === 'getBookmarks') {
    chrome.bookmarks.getTree(function(nodes) {
      nodes.forEach(node => addFaviconSrc(node));
      callback(nodes);
    });
  }
  return true;
});

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
