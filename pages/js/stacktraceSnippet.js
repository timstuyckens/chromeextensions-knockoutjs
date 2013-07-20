ko.subscribable['fn'] ["notifySubscribers"]= function (valueToNotify, event) {
			event = event || defaultEvent;
			if (this._subscriptions[event]) {
				ko.dependencyDetection.ignore(function () {
					var index=0;
					ko.utils.arrayForEach(this._subscriptions[event].slice(0), function (subscription) {
						var defaultName = "notifySubscription" + index,
							valueToNotifyString="",
							niceName = ""; "notifySubscription" + index + "_value_" + valueToNotify.toString();
						
						index++;
						if (valueToNotify instanceof Array) {
							niceName =defaultName+"_Array_" + valueToNotify.length;
						}
							
						else {
							valueToNotifyString = typeof valueToNotify === 'string' ? valueToNotify : valueToNotify.toString();
							//not fully correct (unicode) but good enough for this http://stackoverflow.com/questions/1661197/valid-characters-for-javascript-variable-names
							valueToNotifyString = (/[a-zA-Z_$][0-9a-zA-Z_$]*/.test(valueToNotifyString)) ? valueToNotifyString : valueToNotifyString.replace(/[^0-9a-zA-Z_$]/g, "_");
							if (valueToNotifyString.length > 0) {
								if (valueToNotifyString.length > 20)
									valueToNotifyString = valueToNotifyString.substring(0, 20);
								niceName = defaultName + "_value_" + valueToNotifyString;
							}
						}
						
						var notifySubscription = function () {
							// In case a subscription was disposed during the arrayForEach cycle, check
							// for isDisposed on each subscription before invoking its callback
							if (subscription && (subscription.isDisposed !== true))
								subscription.callback(valueToNotify);
						};
						//wrap the notification in a function so that you can give it a custom name. Nice in stacktraces/profiling
						//give the function as paramter so you can still place a breakpoint in notifySubsciption
						var func = new Function("action", "return function " + niceName + "(){ action() };")(notifySubscription);
						return func();
					});
				}, this);
			}
		};