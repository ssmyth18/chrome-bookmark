$(function () {
  const iframe = $('<iframe />').attr({
    class: 'kr-bookmarks-iframe'
  });
  $('body').append(iframe);
  const iframeBody = iframe.contents().find('body');
  iframe.css({ width: '100%', height: '100%' });

  chrome.runtime.sendMessage('getBookmarks', function (response) {
    const bookmarkUl = $('<ul class="bookmarkUl"></ul>');
    iframeBody.append(bookmarkUl);
    console.log(response[0]);
    response[0].children.forEach(node => addNode(node, bookmarkUl));
  });

  function addNode(node, ul) {
    let item = $(`<li>${node.title}</li>`);
    if (node.url) {
      item = $(`<li><a href="${node.url}"><img src="${node.base64src}"></img>${node.title}</a></li>`);
    }
    if (node.children) {
      const childUl = $('<ul></ul>');
      item.append(childUl);
      node.children.forEach(childNode => addNode(childNode, childUl));
    }
    ul.append(item);
  }
});
