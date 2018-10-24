$(function() {
  const body = $('body');

  const rootDiv = $('<div id="kr-bookmark-rootDiv"></div>');
  rootDiv.addClass('ui vertical menu');
  rootDiv.css({ cssText: 'visibility: hidden; left: -248px !important;' });
  body.append(rootDiv);

  const triggerBtn = $('<button id="kr-bookmark-trigger">Click!</button>');
  // triggerBtn.addClass('ui primary basic button');
  triggerBtn.css({ display: 'none' });
  body.append(triggerBtn);

  rootDiv.slideReveal({
    trigger: triggerBtn,
    shown: function(slider, trigger) {
      rootDiv
        .children()
        .first()
        .focus();
    },
    hide: function(slider, trigger) {
      $(':focus').trigger('blur');
    },
    push: false,
    overlay: true
  });

  chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if (request.name === 'switchDisplay') {
      triggerBtn.trigger('click');
    }
  });

  chrome.runtime.sendMessage({ name: 'getBookmarkList' }, function(response) {
    response[0].children.forEach(node => addBookmarkNode(node, rootDiv));

    $('.ui.dropdown').dropdown({
      action: function(text, value, element) {
        const href = $(text).attr('href');
        rootDiv.attr('href', href);
      }
    });

    rootDiv.find('div').keydown(e => {
      openBookmark(e);
    });

    const defaultStyle = rootDiv.attr('style');
    rootDiv.css({
      cssText:
        defaultStyle +
        'visibility: visible; left: -248px !important; margin-top: 0px;'
    });
  });

  function openBookmark(e) {
    const enterKeyCode = 13;
    if (e.keyCode !== enterKeyCode) {
      return;
    }
    const href = rootDiv.attr('href');
    if (e.ctrlKey) {
      chrome.runtime.sendMessage({ name: 'openPageOnNewTab', href: href });
      return;
    }
    window.location.href = href;
  }

  function addBookmarkNode(node, parentDiv) {
    const nodeTitle = node.title.substr(0, 20);
    if (node.url) {
      addLeafNode(node, parentDiv, nodeTitle);
    }
    if (node.children) {
      addMiddleNode(node, parentDiv, nodeTitle);
    }
  }

  function addMiddleNode(node, parentDiv, nodeTitle) {
    if (node.children.length === 0) {
      return;
    }
    const marginSpace = '　　';
    const item = $(`<div>${nodeTitle}${marginSpace}</div>`);
    item.addClass('ui left pointing dropdown link item');
    item.css({ 'font-size': '14px' });
    parentDiv.append(item);

    item.prepend('<i class="dropdown icon"></i>');
    const menuDiv = $('<div class="menu"></div>');
    item.append(menuDiv);

    node.children.forEach(childNode => addBookmarkNode(childNode, menuDiv));
  }

  function addLeafNode(node, parentDiv, nodeTitle) {
    const item = $(`<div><span>${nodeTitle}</span></div>`);
    item.addClass('item');
    item.find('span').css({ color: 'black', 'font-size': '14px' });
    item.contents().wrap(`<a href="${node.url}"></a>`);

    const imageSrc = `http://www.google.com/s2/favicons?domain=${node.url}`;
    const image = $(`<img src="${imageSrc}"></img>`);
    image.css({ 'vertical-align': 'middle', 'margin-right': '5px' });
    item.children().prepend(image);

    parentDiv.append(item);
  }
});
