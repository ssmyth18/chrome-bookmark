$(function() {
  const body = $('#mouseless-bmselect-body');

  const sidebar = $('<div></div>');
  sidebar.addClass('ui sidebar vertical menu');
  body.append(sidebar);
  const pusher = $('<div id ="pusher"></div>');
  pusher.addClass('pusher');
  body.append(pusher);

  chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if (request.name === 'switchDisplay') {
      if (body.hasClass('mouseless-active')) {
        deactivate();
      } else {
        activate();
      }
    }
  });

  chrome.runtime.sendMessage({ name: 'getBookmarkList' }, function(response) {
    response[0].children.forEach(node => addBookmarkNode(node, sidebar));

    sidebar.sidebar({
      on: 'hover'
    });

    $('.ui.dropdown').dropdown({
      action: function(text, value, element) {
        const href = $(text).attr('href');
        sidebar.attr('href', href);
      }
    });

    body.on('keydown', function(e) {
      const escapeKeyCode = 27;
      if (e.keyCode === escapeKeyCode && body.hasClass('mouseless-active')) {
        deactivate();
      }
    });
    sidebar.on('keydown', function() {
      const currentSelected = $('.selected');
      // TODO like hover events
      // currentSelected.trigger('mouseenter');
    });
    sidebar.find('div').keydown(e => {
      const enterKeyCode = 13;
      if (e.keyCode !== enterKeyCode) {
        return;
      }
      openBookmark(e);
    });
    sidebar.find('.leaf-link').click(e => {
      deactivate();
      e.stopPropagation();
      if (e.ctrlKey) {
        return;
      }
      e.preventDefault();
      const href = $(e.currentTarget).attr('href');
      chrome.runtime.sendMessage({ name: 'openPageOnCurrentTab', href: href });
    });
    pusher.on('click', function() {
      if (body.hasClass('mouseless-active')) {
        deactivate();
      }
    });
  });

  function activate() {
    sidebar.sidebar('toggle');
    sidebar.addClass('visible');
    pusher.addClass('dimmed');
    body.removeClass('mouseless-deactive');
    body.addClass('mouseless-active');
    sidebar
      .children()
      .first()
      .focus();
    chrome.runtime.sendMessage({ name: 'switchIframe', type: 'activate' });
  }

  function deactivate() {
    sidebar.sidebar('toggle');
    sidebar.removeClass('visible');
    pusher.removeClass('dimmed');
    body.removeClass('mouseless-active');
    body.addClass('mouseless-deactive');
    chrome.runtime.sendMessage({ name: 'switchIframe', type: 'deactivate' });
  }

  function openBookmark(e) {
    const href = sidebar.attr('href');
    if (!sidebar) {
      return;
    }
    deactivate();
    if (e.ctrlKey) {
      chrome.runtime.sendMessage({ name: 'openPageOnNewTab', href: href });
    } else {
      chrome.runtime.sendMessage({ name: 'openPageOnCurrentTab', href: href });
    }
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
    const item = $(
      `<div><span class="leaf item-span">${nodeTitle}</span></div>`
    );
    item.addClass('leaf item');
    const leafLink = $(`<a href="${node.url}"></a>`);
    leafLink.addClass('leaf-link');
    item.contents().wrap(leafLink);

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
