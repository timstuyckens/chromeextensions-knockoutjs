
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
		watchRefresh: function (cb) {
			var port = chrome.extension.connect();
			port.postMessage({
				action: 'register',
				inspectedTabId: chrome.devtools.inspectedWindow.tabId
			});
			port.onMessage.addListener(function(msg) {
				if (msg === 'refresh' && cb) {
					cb();
				}
			});
			port.onDisconnect.addListener(function (a) {
				console.log(a);
			});
		}
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
			var chromeExtensionLogChangeFun=function(target, option) {
				var indent="   ";
				var total="";
				for(var i=0;i<option.nestingLevel;i++){
					total+=indent;
				}
				
				target.subscribe(function(newValue) {
					console.debug(total,option.propName, newValue);
					console.timeStamp(option.propName+" changed (ko)");
				});
				return target;
			};
			ko.extenders.ChromeExtensionLogChange = chromeExtensionLogChangeFun;
			
			
			//crazy code that will loop all nodes an get all the knockout binded viewmodels on a page
			var viewModels=[];
			var items = document.getElementsByTagName("*");
			for (var i = 0; i < items.length; i++) {
				try{
					var theContextFor=ko.contextFor(items[i]);
					var theVm=theContextFor.$data;	
					var theNestingLevel=theContextFor.$parents.length;
					var isAlreadyInArray=false;
					for(var j=0;j<viewModels.length;j++)
						if(viewModels[j].viewmodel==theVm)
							isAlreadyInArray=true;
					if(!isAlreadyInArray)
						viewModels.push({viewmodel:theVm,level:theNestingLevel});
				}
				catch(toBeIgnoredExc){}
			}
			
			if(!viewModels.length){
				return;
			}
			//add extender to each observable/array/computed that will log changes 
			for(var k=0;k<viewModels.length;k++){
				var tempVm=viewModels[k].viewmodel;
				var nestingLevel=viewModels[k].level;
				for (var vmProperty in tempVm) {
					try{
						if (!tempVm.hasOwnProperty(vmProperty)) 
							continue;	
						if(tempVm[vmProperty]===null || tempVm[vmProperty]===undefined)
							continue;
						if(!ko.isSubscribable(tempVm[vmProperty]))
							continue;
						tempVm[vmProperty].extend({ChromeExtensionLogChange: {propName:vmProperty,nestingLevel:nestingLevel}});
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
	chromeExtension.watchRefresh(function(){
		$("#enableTracing").text("Enable Tracing").removeAttr("disabled");
	});

});