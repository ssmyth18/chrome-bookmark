$(function() {
  const body = $('body');

  const iframe = $('<iframe id="mouseless-bmselect-iframe"></iframe>');
  const iframeSrc = 'html/mouseless-bmselect-iframe.html';
  iframe.attr('src', chrome.extension.getURL(iframeSrc));
  iframe.addClass('mouseless-deactive');
  body.append(iframe);

  chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if (request.name === 'switchDisplay') {
      switchDisplay();
    }
    if (request.name === 'activate') {
      activate();
    }
    if (request.name === 'deactivate') {
      deactivate();
    }
  });

  function switchDisplay() {
    if (iframe.hasClass('mouseless-active')) {
      deactivate();
    } else {
      activate();
    }
  }

  function activate() {
    iframe.removeClass('mouseless-deactive');
    iframe.addClass('mouseless-active');
    chrome.runtime.sendMessage({ name: 'activateSidebar' });
  }

  function deactivate() {
    iframe.removeClass('mouseless-active');
    iframe.addClass('mouseless-deactive');
    chrome.runtime.sendMessage({ name: 'deactivateSidebar' });
  }
});
