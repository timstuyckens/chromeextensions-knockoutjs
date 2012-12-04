// The function is executed in the context of the inspected page.
var page_getKnockoutInfo = function() {
	var debug=function(m){
		//console.log(m);
	};
	if( !window.ko){
		return {error:"knockout.js is not used in the page (ko is undefined)"};
	}
	
	var isString = function (obj) {	// _ implementation
	  return toString.call(obj) == '[object String]';
	}
	
	var i=0;
	// Make a shallow copy with a null prototype, don't show prototype stuff in panel
	var copy = { __proto__: null };
	var copy2 = { __proto__: null };
	debug($0);
	var context = window.jQuery && $0 ?ko.contextFor($0) : {};
	debug("context ");
	debug(context);

	try{
		var props = Object.getOwnPropertyNames(context);
	}
	catch(err){
		//when you don't select a dom node but plain text  (rare)
		return {info:"Please select a dom node"}; 
	}
	for (i = 0; i < props.length; ++i){
		//you probably want to see the value of the index instead of the ko.observable function
		if(props[i]==="$index"){
			copy["$index()"] = context[props[i]]();	
		}
		else{
			copy[props[i]] = context[props[i]];
		}
	}

	var data = window.jQuery && $0 ?ko.toJS(ko.dataFor($0)) : {};
	debug("data ");
	debug(data);
	if(isString(data)){	//don't do getOwnPropertyNames if it's not an object
		copy["vm_string"]=data;
	}
	else{
		try{
			var props2 = Object.getOwnPropertyNames(data);		
			for (i = 0; i < props2.length; ++i){
				copy2[props2[i]] = data[props2[i]];	
			}
			copy["vm_toJS"]=copy2;
		  }
		catch(err){
			//I don't know the type but I'll try to display the data
			copy["vm_no_object"]=data;
		 }
	}
	return copy;
}
var pluginTitle="Knockout context"
chrome.devtools.panels.elements.createSidebarPane(pluginTitle,function(sidebar) {

  function updateElementProperties() {
	//pase a function as a string that will be executed later on by chrome
	sidebar.setExpression("(" + page_getKnockoutInfo.toString() + ")()");
  }
  //initial
  updateElementProperties();
  //attach to chrome events so that the sidebarPane refreshes (contains up to date info)
  chrome.devtools.panels.elements.onSelectionChanged.addListener(updateElementProperties);
  sidebar.onShown.addListener(updateElementProperties);


});
