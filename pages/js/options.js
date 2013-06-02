
$(function(){
	var shouldPanelBeShownKey="shouldPanelBeShown";
	
	var restorePreviousSettings=function(){
		var localStorageValue=localStorage[shouldPanelBeShownKey];
		if(localStorageValue){
			var settingValue=JSON.parse(localStorageValue);
			$("#shouldPanelBeShownCheckbox").attr('checked', settingValue);		
		}
		else{
			$("#shouldPanelBeShownCheckbox").prop('checked', true);
		}
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
});
