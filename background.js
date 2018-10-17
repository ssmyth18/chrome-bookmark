chrome.runtime.onMessage.addListener(function (request, sender, callback) {
  if (request === 'getBookmarks') {
    chrome.bookmarks.getTree(function (nodes) {
      nodes.forEach(node => {
        addBase64(node);
      })
      callback(nodes);
    });
  }
  return true;
});

function addBase64(node) {
  if (node.url) {
    const image = new Image();
    image.src = `chrome://favicon/${node.url}`;
    const base64 = ImageToBase64(image, 'image/x-icon');
    node.base64src = base64;
  }
  if (node.children) {
    node.children.forEach(childNode => addBase64(childNode));
  }
}

function ImageToBase64(img, mime_type) {
  // New Canvas
  var canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  // Draw Image
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  // To Base64
  return canvas.toDataURL(mime_type);
}
