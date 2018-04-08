chrome.browserAction.onClicked.addListener(function(t) {
	chrome.tabs.sendMessage(t.id, {text: 'switch'}, function(){});
});
