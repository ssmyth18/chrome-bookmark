$(function() {
  const body = $('body');

  const iframe = $('<iframe id="mouseless-bmselect-iframe"></iframe>');
  const iframeSrc = 'html/mouseless-bmselect-iframe.html';
  iframe.attr('src', chrome.extension.getURL(iframeSrc));
  iframe.addClass('mouseless-deactive');
  body.append(iframe);

  chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if (request.name === 'switchIframe') {
      switchIframe(request);
    }
  });

  function switchIframe(request) {
    if (request.type === 'activate') {
      activateIframe();
    } else {
      deactivateIframe();
    }
  }

  function activateIframe() {
    iframe.removeClass('mouseless-deactive');
    iframe.addClass('mouseless-active');
  }

  function deactivateIframe() {
    iframe.removeClass('mouseless-active');
    iframe.addClass('mouseless-deactive');
  }
});
