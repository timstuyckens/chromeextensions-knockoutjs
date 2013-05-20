
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
		},
	};
	var attachLoggingExtender=function(globalWindowObj){
		try{
			
			//require js support
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
					return ;
				}
			}
			
			
			//create the extender in the context of the page
			ko.extenders.ChromeExtensionLogChange = function(target, option) {
				target.subscribe(function(newValue) {
					console.debug(option, newValue);
					console.markTimeline(option+" changed (ko)");
				});
				return target;
			};
			
			
			//crazy code that will loop all nodes an get all the knockout binded viewmodels on a page
			var viewModels=[];
			var items = document.getElementsByTagName("*");
			for (var i = 0; i < items.length; i++) {
				try{
					var theVm=ko.contextFor(items[i]).$data;	
					var isAlreadyInArray=false;
					for(var j=0;j<viewModels.length;j++)
						if(viewModels[j]==theVm)
							isAlreadyInArray=true;
					if(!isAlreadyInArray)
						viewModels.push(theVm);
				}
				catch(toBeIgnoredExc){}
			}
			
			if(!viewModels.length){
				return;
			}
			//add extender to each observable/array/computed that will log changes 
			for(var k=0;k<viewModels.length;k++){
				var tempVm=viewModels[k];
				for (var vmProperty in tempVm) {
					try{
						if (!tempVm.hasOwnProperty(vmProperty)) 
							continue;	
						if(tempVm[vmProperty]===null || tempVm[vmProperty]===undefined)
							continue;
						if(!ko.isSubscribable(tempVm[vmProperty]))
							continue;
						tempVm[vmProperty].extend({ChromeExtensionLogChange: vmProperty});
					}
					catch(unableToExtendException){
						console.log("Unable to extend the viewmodel",vmProperty,tempVm);
					}
				}
			}
		}
		catch(err){
			console.error(err);	
		}
	};
	
	var chromeExtensionEvalCallback=function(promise){
		//disable the button so you can only attach the extender once
		$("#enableTracing").text("Tracing enabled").attr("disabled","disabled");
	};
	
	$("#enableTracing").click(function(){
		chromeExtension.eval(attachLoggingExtender,true,chromeExtensionEvalCallback);
	});
	
});