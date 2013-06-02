
$(function(){
	
	var shouldPanelBeShownKey="shouldPanelBeShown";
	
	var restorePreviousSettings=function(){
		var localStorageValue=localStorage[shouldPanelBeShownKey];
		if(!localStorageValue)
			return
		var settingValue=JSON.parse(localStorageValue)
		$("#shouldPanelBeShownCheckbox").attr('checked', settingValue);
	};
	
	restorePreviousSettings();
	
	//when checkbox changes, directly save value in localstorage
	$("#shouldPanelBeShownCheckbox").change(function(){
		var el=$(this);
		var val=el.is(':checked')
		localStorage[shouldPanelBeShownKey]=JSON.stringify(val);
	});

});
