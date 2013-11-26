
$(function(){
	var shouldPanelBeShownKey="shouldPanelBeShown";
	var shouldDoKOtoJSKey="shouldDoKOtoJS";
	var shouldAddEditMethodsKey="shouldAddEditMethods";
	
	var restorePreviousSettings=function(){
	
		var checkBoxes=[
			{settingKey:shouldPanelBeShownKey,domSelector:"#shouldPanelBeShownCheckbox",defaultValue:true},
			{settingKey:shouldDoKOtoJSKey,domSelector:"#shouldDoKOtoJSCheckbox",defaultValue:true},
			{settingKey:shouldAddEditMethodsKey,domSelector:"#shouldAddEditMethodsCheckbox",defaultValue:false},
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
	
	var setValueSafelyInLocalStorage=function(key,notStringifiedValue){
		try{
			localStorage[key]=JSON.stringify(notStringifiedValue);
			$("#infoMessage").closest(".alert").removeClass("alert-error");
			$("#infoMessage").closest(".alert").find("h4").text("Saved");
			return true;
		}
		catch(e){
			$infoMessage.html("Unable to change the setting. Probably because you have blocked localstorage/cookies in the privacy settings of Chrome.");
			$("#infoMessage").closest(".alert").removeClass("alert-success").addClass("alert-error");
			$("#infoMessage").closest(".alert").find("h4").text("Error");
			return false;
		}
	};
	
	restorePreviousSettings();
	
	var $infoMessage=$("#infoMessage");
	//when checkbox changes, directly save value in localstorage
	$("#shouldPanelBeShownCheckbox").change(function(){
		$(".alert").removeClass("hide");
		var el=$(this);
		var val=el.is(':checked');
		if(setValueSafelyInLocalStorage(shouldPanelBeShownKey,val)){
			if(val){
				$infoMessage.html("Happy tracing");
			}
			else{
				$infoMessage.html("If you disabled it because it didn't worked for you, please file a bug on the <a href='https://github.com/timstuyckens/chromeextensions-knockoutjs'>github page </a>");
			}
		}
	});

	$("#shouldDoKOtoJSCheckbox").change(function(){
		var el=$(this);
		var val=el.is(':checked');
		setValueSafelyInLocalStorage(shouldDoKOtoJSKey,val);
	});	

	$("#shouldAddEditMethodsCheckbox").change(function(){
		var el=$(this);
		var val=el.is(':checked');
		setValueSafelyInLocalStorage(shouldAddEditMethodsKey,val);
	});	
	
});
