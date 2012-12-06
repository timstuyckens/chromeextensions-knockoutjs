
//you cannot use the chrome.windows api in the devtools.js page.
chrome.windows.onFocusChanged.addListener(function(windowId) {
	//send message to devtool.js. Then you can re-evaluate ko.dataFor($0)
	chrome.tabs.getSelected(null, function(tab) {
	  chrome.tabs.sendMessage(tab.id, {}, function(response) {
	  });
	});
});

