$(function() {
  const body = $('body');

  const rootDiv = $('<div id="kr-bookmark-rootDiv"></div>');
  rootDiv.addClass('ui vertical menu');
  rootDiv.css({ cssText: 'left: -248px !important;' });
  body.append(rootDiv);

  const triggerBtn = $('<button id="kr-bookmark-trigger"">Test!</button>');
  triggerBtn.addClass('ui primary basic button');
  body.append(triggerBtn);

  $('#kr-bookmark-rootDiv').slideReveal({
    trigger: $('#kr-bookmark-trigger'),
    push: false,
    overlay: true
  });

  chrome.runtime.sendMessage('getBookmarks', function(response) {
    response[0].children.forEach(node => addBookmarkNode(node, rootDiv));
    $('.ui.dropdown').dropdown();
    const defaultStyle = $('#kr-bookmark-rootDiv').attr('style');
    $('#kr-bookmark-rootDiv').css({
      cssText: defaultStyle + 'left: -248px !important; margin-top: 0px;'
    });
  });

  function addBookmarkNode(node, parentDiv) {
    const nodeTitle = node.title.substr(0, 20);
    if (node.url) {
      const item = $(`<div>${nodeTitle}</div>`);
      item.addClass('item');
      item.contents().wrap(`<a href="${node.url}"></a>`);
      item.children().prepend(`<img src="${node.faviconSrc}"></img>`);
      parentDiv.append(item);
    }
    if (node.children) {
      const item = $(`<div>${nodeTitle}</div>`);
      item.addClass('ui left pointing dropdown link item');
      parentDiv.append(item);

      item.prepend('<i class="dropdown icon"></i>');
      const menuDiv = $('<div class="menu">');
      item.append(menuDiv);

      node.children.forEach(childNode => addBookmarkNode(childNode, menuDiv));
    }
  }
});
