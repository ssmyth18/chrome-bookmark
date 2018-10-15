$(function() {
  let iframe = $('<iframe />').attr({
    class: 'kr-bookmarks-iframe'
  });
  $('body').append(iframe);
  let iframeBody = iframe.contents().find('body');
  iframe.css({ width: '100%', height: '100%' });

  chrome.runtime.sendMessage('getBookmarks', function(response) {
    let bookmarkUl = $('<ul class="bookmarkUl"></ul>');
    iframeBody.append(bookmarkUl);
    response[0].children.forEach(node => {
      addNode(node, bookmarkUl);
    });
  });

  function addNode(node, bookmarkUl) {
    console.log(`<div>${node.title}</div>`);
    let item = $(`<li>${node.title}</li>`);
    console.log(item);
    bookmarkUl.append(item);
  }
});
