
//you cannot use the chrome.windows api in the devtools.js page.
chrome.windows.onFocusChanged.addListener(function(windowId) {
	//send message to devtool.js. Then you can re-evaluate ko.dataFor($0)
	chrome.tabs.getSelected(null, function(tab) {
	  chrome.tabs.sendMessage(tab.id, {}, function(response) {
	  });
	});
});

// notify of page refreshes
chrome.extension.onConnect.addListener(function(port) {
  port.onMessage.addListener(function (msg) {
    if (msg.action === 'register') {
      var respond = function (tabId, changeInfo, tab) {
        if (tabId !== msg.inspectedTabId) {
          return;
        }
        port.postMessage('refresh');
      };

      chrome.tabs.onUpdated.addListener(respond);
      port.onDisconnect.addListener(function () {
        chrome.tabs.onUpdated.removeListener(respond);
      });
    }
  });
});


