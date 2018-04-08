var icons = ["icon128_a.png", "icon128_b.png", "icon128_c.png"]

// Send messages to "content.js"
chrome.browserAction.onClicked.addListener(function(t) {
	chrome.tabs.sendMessage(t.id, {text: 'switch'}, function(){});
});

// Support pushState-based sites (eg. YouTube)
// REF: https://stackoverflow.com/questions/18397962/chrome-extension-is-not-loading-on-browser-navigation-at-youtube/18398921#18398921
chrome.webNavigation.onHistoryStateUpdated.addListener(function (details){
	chrome.tabs.sendMessage(details.tabId, {text: 'transitioned'}, function(){});
});

// Listen for messages from "content.js"
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.text === 'not_available'){
  	chrome.browserAction.setIcon({
  	    path: icons[0],
  	    tabId: sender.tab.id
  	});
 	} else if (msg.text === 'disabled'){
 		chrome.browserAction.setIcon({
 		    path: icons[1],
 		    tabId: sender.tab.id
 		});
 	} else if (msg.text === 'enabled'){
 		chrome.browserAction.setIcon({
 		    path: icons[2],
 		    tabId: sender.tab.id
 		});
 	}
});

