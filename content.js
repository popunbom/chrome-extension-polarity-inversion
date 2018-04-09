var	audioCtx = new AudioContext();
var	source = null;
var	effectIn  = audioCtx.createChannelSplitter(2);
var	effectOut = audioCtx.createChannelMerger(2);
var	isInverted = false;

function getAudioSrc() {
	var elems = document.querySelector('video') || document.querySelector('audio');
	if (elems == null){
		chrome.runtime.sendMessage({text: 'not_available'}, function(){});
		return false;
	} else {
		source = audioCtx.createMediaElementSource(elems);		
		chrome.runtime.sendMessage({text: 'disabled'}, function(){});
		return true;
	}
}

// This is Contents Script
function init(){
	// Get Audio Resource
	if (source == null) {
		var flag = getAudioSrc();
	}
	if (flag){
		initEffect();
		source.connect(audioCtx.destination);
		if (isInverted){
			switchEffect();
		}
	}
}

// invert polarity of L-ch
function initEffect() {
	// src --> splitter
	source.connect(effectIn);
	// gain.value = -1.0 <=> Polarity Inversion
	var gNode = audioCtx.createGain();
	gNode.gain.setValueAtTime(-1.0, 0);
	effectIn.connect(gNode, 0);
	// Channel Merge
  gNode.connect(effectOut, 0, 0);
	effectIn.connect(effectOut, 1, 1);

	console.log("init completed !");
	return;
}

// Switch Effect ON/OFF
function switchEffect(){
	if (isInverted){
		// Disconnect
		source.disconnect(effectIn);	
		effectOut.disconnect(audioCtx.destination);
		// Re-Connect
		source.connect(audioCtx.destination);
		chrome.runtime.sendMessage({text: 'disabled'}, function(){
			console.log("PolarityInversion: Disabled");
		});
	} else {
		// Disconnect
		source.disconnect(audioCtx.destination);
		// Re-Connect
		source.connect(effectIn);
		effectOut.connect(audioCtx.destination);
		chrome.runtime.sendMessage({text: 'enabled'}, function(){
			console.log("PolarityInversion: Enabled");
		});
	}
	isInverted = !isInverted
}

// Execute init AFTER html loaded.
// window.onload = function() {
window.addEventListener("load", init);


// Listen for messages from "background.js"
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.text === 'switch') {
	 	// Switch Effect
	 	switchEffect();
 	} else if (msg.text === 'transitioned'){
 		// Re-init
 		init();
 	}

});


