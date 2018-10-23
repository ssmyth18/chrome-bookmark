$(function() {
  const body = $('body');

  const rootDiv = $('<div id="kr-bookmark-rootDiv"></div>');
  rootDiv.addClass('ui vertical menu');
  rootDiv.css({ cssText: 'visibility: hidden; left: -248px !important;' });
  body.append(rootDiv);

  const triggerBtn = $('<button id="kr-bookmark-trigger""></button>');
  triggerBtn.css({display: 'none'});
  body.append(triggerBtn);

  $(window).keydown(function(e) {
    if (e.ctrlKey && e.keyCode === 66) {
      triggerBtn.trigger('click');
    }
  });

  rootDiv.slideReveal({
    trigger: triggerBtn,
    shown: function(slider, trigger) {
      rootDiv.children().first().focus();
    },
    hide: function (slider, trigger) {
      $(':focus').trigger('blur');
    },
    push: false,
    overlay: true
  });

  chrome.runtime.sendMessage('getBookmarks', function(response) {
    response[0].children.forEach(node => addBookmarkNode(node, rootDiv));
    $('.ui.dropdown').dropdown();
    const defaultStyle = rootDiv.attr('style');
    rootDiv.css({
      cssText: defaultStyle + 'visibility: visible; left: -248px !important; margin-top: 0px;'
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
