
$(function(){
	var shouldPanelBeShownKey="shouldPanelBeShown";
	var shouldDoKOtoJSKey="shouldDoKOtoJS";
	
	var restorePreviousSettings=function(){
	
		var checkBoxes=[
			{settingKey:shouldPanelBeShownKey,domSelector:"#shouldPanelBeShownCheckbox",defaultValue:true},
			{settingKey:shouldDoKOtoJSKey,domSelector:"#shouldDoKOtoJSCheckbox",defaultValue:true}
		];
		$.each(checkBoxes,function(i,val){
			var localStorageValue=localStorage[val.settingKey];
			if(localStorageValue){
				var settingValue=JSON.parse(localStorageValue);
				$(val.domSelector).attr('checked', settingValue);		
			}
			else{
				$(val.domSelector).prop('checked', val.defaultValue);
			}		
		});
	

	};
	
	restorePreviousSettings();
	
	var $infoMessage=$("#infoMessage");
	//when checkbox changes, directly save value in localstorage
	$("#shouldPanelBeShownCheckbox").change(function(){
		$(".alert").removeClass("hide");
		var el=$(this);
		var val=el.is(':checked');
		localStorage[shouldPanelBeShownKey]=JSON.stringify(val);
		if(val){
			$infoMessage.html("Happy tracing");
		}
		else{
			$infoMessage.html("If you disabled it because it didn't worked for you, please file a bug on the <a href='https://github.com/timstuyckens/chromeextensions-knockoutjs'>github page </a>");
		}
	});

	$("#shouldDoKOtoJSCheckbox").change(function(){
		var el=$(this);
		var val=el.is(':checked');
		localStorage[shouldDoKOtoJSKey]=JSON.stringify(val);
	});	
	
});
