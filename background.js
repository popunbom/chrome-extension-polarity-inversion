var icons = ["icon128_a.png", "icon128_b.png", "icon128_c.png"]

// Send messages to "content.js"
chrome.browserAction.onClicked.addListener(function(t) {
	chrome.tabs.sendMessage(t.id, {text: 'switch'}, function(){});
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
