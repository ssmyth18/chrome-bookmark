$(function() {
  const body = $('#mouseless-bmselect-body');

  const sidebar = $('<div></div>');
  sidebar.addClass('ui sidebar vertical menu');
  body.append(sidebar);
  const pusher = $('<div id ="pusher"></div>');
  pusher.addClass('pusher');
  body.append(pusher);

  chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if (request.name === 'activateSidebar') {
      activateSidebar();
    }
    if (request.name === 'deactivateSidebar') {
      deactivateSidebar();
    }
  });

  chrome.runtime.sendMessage({ name: 'getBookmarkList' }, function(response) {
    response[0].children.forEach(node => addBookmarkNode(node, sidebar));

    sidebar.sidebar({
      on: 'hover',
      onShow: function() {
        sidebar
          .children()
          .first()
          .focus();
      }
    });

    $('.ui.dropdown').dropdown({
      action: function(text, value, element) {
        const href = $(text).attr('href');
        sidebar.attr('href', href);
      }
    });

    // sidebar.on('keydown', function() {
    //   const currentSelected = $('.selected');
    //   // TODO like hover events
    //   // currentSelected.trigger('mouseenter');
    // });
    sidebar.find('div').keydown(e => {
      openBookmark(e);
    });
    body.on('keydown', function(e) {
      const escapeKeyCode = 27;
      if (e.keyCode === escapeKeyCode) {
        if (sidebar.hasClass('visible')) {
          chrome.runtime.sendMessage({ name: 'deactivate' });
        }
      }
    });
    pusher.on('click', function() {
      if (sidebar.hasClass('visible')) {
        chrome.runtime.sendMessage({ name: 'deactivate' });
      }
    });
  });

  function activateSidebar() {
    sidebar.sidebar('toggle');
  }

  function deactivateSidebar() {
    sidebar.sidebar('toggle');
  }

  function openBookmark(e) {
    const enterKeyCode = 13;
    if (e.keyCode !== enterKeyCode) {
      return;
    }
    chrome.runtime.sendMessage({ name: 'deactivate' });
    const href = sidebar.attr('href');
    if (e.ctrlKey) {
      chrome.runtime.sendMessage({ name: 'openPageOnNewTab', href: href });
      return;
    }
    chrome.runtime.sendMessage({ name: 'openPageOnCurrentTab', href: href });
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

  function addLeafNode(node, parentDiv, nodeTitle) {
    const item = $(`<div><span class="item-span">${nodeTitle}</span></div>`);
    item.addClass('item');
    item.contents().wrap(`<a href="${node.url}"></a>`);

    if (node.url.match(/^http.*/)) {
      const imgSrc = `https://www.google.com/s2/favicons?domain=${node.url}`;
      const img = $(`<img src="${imgSrc}"></img>`);
      img.addClass('favicon');
      item.children().prepend(img);
    } else {
      // TODO add alternative icon
    }

    parentDiv.append(item);
  }

  function addMiddleNode(node, parentDiv, nodeTitle) {
    if (node.children.length === 0) {
      return;
    }
    const item = $(`<div><span class="item-span">${nodeTitle}</span></div>`);
    item.addClass('ui left pointing dropdown link item');
    parentDiv.append(item);

    item.prepend('<i class="dropdown icon"></i>');
    const menuDiv = $('<div class="menu"></div>');
    item.append(menuDiv);

    // TODO add alternative icon

    node.children.forEach(childNode => addBookmarkNode(childNode, menuDiv));
  }
});
