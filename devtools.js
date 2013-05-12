// The function is executed in the context of the inspected page.
var page_getKnockoutInfo = function() {
	"use strict";
	var debug=function(m){
		//console.log(m);
	};
	
	var ko = window.ko;
	if( !ko){
		if(typeof window.require === 'function') {
			try{
				ko = require('ko');
			} catch(e) { /*ingore */ }
			if(!ko){
				try{
					ko = require('knockout');
				} catch(e) { /*ingore */ }
			}
		}
		if(!ko) {
			return {error:"knockout.js is not used in the page (ko is undefined). Maybe u are using iFrames, if so, browse to the url of the frame and try again."};
		}
	}
	
	var isString = function (obj) {	// _ implementation
		return toString.call(obj) == '[object String]';
	};
	
	function isFunction(functionToCheck) {
		var getType = {};
		var res= functionToCheck && getType.toString.call(functionToCheck) == '[object Function]';
		return res;
	}

	var i=0;
	// Make a shallow copy with a null prototype, don't show prototype stuff in panel
	var copy = { __proto__: null };
	var copy2 = { __proto__: null };
	debug($0);
	var context = $0 ?ko.contextFor($0) : {};
	debug("context ");
	debug(context);

	try{
		var props = Object.getOwnPropertyNames(context);
		for (i = 0; i < props.length; ++i){
			//you probably want to see the value of the index instead of the ko.observable function
			if(props[i]==="$index"){
				copy["$index()"] = context[props[i]]();	
			}
			else if(props[i]==="$root"){
				if(context[props[i]] != window){
					copy["$root_toJS"] = ko.toJS(context[props[i]]);
				}
				else{
					copy["$root"]="(Global window object)";
				}
			}
			else{
				copy[props[i]] = context[props[i]];
			}
		}
	}
	catch(err){
		//when you don't select a dom node but plain text  (rare)
		debug(err);
		return {info:"Please select a dom node with ko data."}; 
	}
	var data = $0 ?ko.toJS(ko.dataFor($0)) : {};
	if(isString(data)){	//don't do getOwnPropertyNames if it's not an object
		copy["vm_string"]=data;
	}
	else{
		try{
			var props2 = Object.getOwnPropertyNames(data);		
			for (i = 0; i < props2.length; ++i){
				//create a empty object that contains the whole vm in a expression. contains even the functions.
				copy2[props2[i]] = data[props2[i]];	
				//show the basic properties of the vm directly, without the need to collapse anything
				if(!isFunction(data[props2[i]])){
					//chrome sorts alphabetically, make sure the properties come first
					copy[" "+props2[i]] = data[props2[i]];	
				}
			}
			//set the whole vm in a expression (collapsable). contains even the functions.
			copy["vm_toJS"]=copy2;
	
		}
		catch(err){
			//I don't know the type but I'll try to display the data
			copy["vm_no_object"]=data;
		}
	}
	return copy;
};
var pluginTitle="Knockout context";
chrome.devtools.panels.elements.createSidebarPane(pluginTitle,function(sidebar) {
	"use strict";
	function updateElementProperties() {
		//pase a function as a string that will be executed later on by chrome
		sidebar.setExpression("(" + page_getKnockoutInfo.toString() + ")()");
	}
	//initial
	updateElementProperties();
	//attach to chrome events so that the sidebarPane refreshes (contains up to date info)
	chrome.devtools.panels.elements.onSelectionChanged.addListener(updateElementProperties);
	sidebar.onShown.addListener(updateElementProperties);

  //listen to a message send by the background page (when the chrome windows's focus changes) 
  chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
      updateElementProperties();
  });
  
});


// knockout panel
var knockoutPanel = chrome.devtools.panels.create(
  "KnockoutJS",
  "logo.png",
  "panel.html"
);
