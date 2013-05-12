
$(function(){
	//abstraction wrapper around extension api, stolen from batarang :)
	var chromeExtension= {
		sendRequest: function (requestName, cb) {
			chrome.extension.sendRequest({
			script: requestName,
			tab: chrome.devtools.inspectedWindow.tabId
			}, cb || function () {});
		},

		eval: function (fn, args, cb) {
			// with two args
			if (!cb && typeof args === 'function') {
				cb = args;
				args = {};
			} else if (!args) {
				args = {};
			}
			chrome.devtools.inspectedWindow.eval('(' +
				fn.toString() +
				'(window, ' +
				JSON.stringify(args) +
				'));', cb);
		}
	};
	
	function logChange(opt,val){
		$("#tracingOutput").append(opt+" "+val);	
	};
	
	$("#enableTracing").click(function(){
		chromeExtension.eval(function(logFunction){
			try{
				if(!window.ko)
					return;
				//create the extender in the context of the page
				ko.extenders.ChromeExtensionLogChange = function(target, option) {
					target.subscribe(function(newValue) {
						console.debug(option, newValue);
					});
					return target;
				};
				
				//add extender to each observable/array/computed that will log changes 
				var theVm=ko.contextFor($("body")[0]).$root;
				if(!theVm)
					return;
				for (var vmProperty in theVm) {
					if (!theVm.hasOwnProperty(vmProperty)) 
						continue;	
					if(!ko.isSubscribable(theVm[vmProperty]))
						continue;
					theVm[vmProperty].extend({ChromeExtensionLogChange: vmProperty});
				}
			}
			catch(err){
				console.debug("Error in panel for Knockout context debugger");		
				console.error(err);						
			}

			
		},true, //dummy arg
		function(){
			$("#enableTracing").text("Tracing enabled").attr("disabled","disabled");
		});
	});
	
});