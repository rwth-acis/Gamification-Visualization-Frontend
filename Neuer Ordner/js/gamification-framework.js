var oidc_userinfo;

var GFramework = function (appId,memberId, serviceEndPoint){
    this._memberId = memberId;
    this._appId = appId;
    this.util.setServiceEndPoint(serviceEndPoint);
   
};  

GFramework.prototype.util = function(){
	var _serviceEndPoint;
	var getServiceEndPoint = function(){
		return _serviceEndPoint;
	};
	var setServiceEndPoint = function(s){
		_serviceEndPoint = s;
	};
	var postOneWithJSON = function(endPointURL, content, useNotification,successCallback, errorCallback){
		var objsent = JSON.stringify(content);
		return sendRequest(
			"POST",
			endPointURL,
			objsent,
			"application/json",
			{},
			function(data, type){
				successCallback(data,type);				
				return false;
			},
			function(status,error) {
				errorCallback(status,error);
		        return false;
			}
		);
	};

	var putOneWithJSON = function(endPointURL, content,successCallback, errorCallback){
		var objsent = JSON.stringify(content);
		return sendRequest(
			"PUT",
			endPointURL,
			objsent,
			"application/json",
			{},
			function(data, type){
				successCallback(data,type);
				return false;
			},
			function(status,error) {
				errorCallback(status,error);
		        return false;
			}
		);
	};
	var postOneWithFormData = function(endPointURL, content,successCallback, errorCallback){
		return sendRequest(
			"POST",
			endPointURL,
			content,
			false,
			{},
			function(data, type){
				successCallback(data,type);
				return false;
			},
			function(status,error) {
				errorCallback(status,error);
		        return false;
			}
		);
	};

	var	putOneWithFormData = function(endPointURL, content,successCallback, errorCallback){
		return sendRequest(
			"PUT",
			endPointURL,
			content,
			false,
			{},
			function(data, type){
				successCallback(data,type);
				return false;
			},
			function(error) {
		        errorCallback(status,error);
				return false;
			}
		);
	};
	var deleteOne =  function(endPointURL,successCallback, errorCallback){
		return sendRequest(
			"DELETE",
			endPointURL,
			"",
			false,
			{},
			function(data, type){
				successCallback(data,type);
				return false;
			},
			function(status,error) {
				errorCallback(status,error);
				return false;
		    }
		);
	};
	var getOne =  function(endPointURL,successCallback, errorCallback){
		return sendRequest(
			"GET",
			endPointURL,
			"",
			false,
			{},
			function(data, type){
				successCallback(data,type);
				return false;
			},
			function(status,error) {
				errorCallback(status,error);
				return false;
		    }
		);
	};
	var getAll = function(endPointURL,successCallback, errorCallback,options){
		var current = 1, rowCount = -1, searchPhrase = "";
		if(options){
			if(options.current){
				current = options.current;
			}
			if(options.rowCount){
				rowCount = options.rowCount;
			}
			if(options.searchPhrase){
				searchPhrase = options.searchPhrase;
			}
		}
		var query = "?current="+current+"&rowCount="+rowCount+"&searchPhrase="+searchPhrase;
		return sendRequest(
			"GET",
			endPointURL+query,
			"",
			false,
			{},
			function(data, type){
				successCallback(data,type);
				return false;
			},
			function(status,error) {
		         errorCallback(status,error);
		         return false;
		    }
		);
	};
	var getAllSimple = function(endPointURL,successCallback, errorCallback){
		return sendRequest(
			"GET",
			endPointURL,
			"",
			false,
			{},
			function(data, type){
				successCallback(data,type);
				return false;
			},
			function(status,error) {
		         errorCallback(status,error);
		         return false;
		    }
		);
	};
	var sendRequest = function(method, relativePath, content, mime, customHeaders, successCallback, errorCallback) {
		var mtype = "text/plain; charset=UTF-8"
		if(mime !== 'undefined') {
			mtype = mime;
		}
	
		var rurl = getServiceEndPoint() + relativePath;
		console.log(rurl);
		if(!isAnonymous()){
			console.log("Authenticated request");
			if(rurl.indexOf("\?") > 0){	
				rurl += "&access_token=" + window.localStorage["access_token"];
			} else {
				rurl += "?access_token=" + window.localStorage["access_token"];
			}
		} else {
			console.log("Anonymous request... ");
		}

		var ajaxObj = {
			url: rurl,
			type: method.toUpperCase(),
			processData: false,
			data: content,
			contentType: mtype,
			crossDomain: true,
			headers: {},
			 beforeSend: function (isUsed,modalElement) {
		        $("#modalspinner").show();
		    },
		    complete: function (isUsed,modalElement) {
		        $("#modalspinner").hide();
		     },
			error: function (xhr, errorType, error) {
				console.log(xhr);
				var errorText = error;
				if (xhr.responseText != null && xhr.responseText.trim().length > 0) {
					errorText = xhr.responseText;
				}
				console.log(errorText);
				errorCallback(xhr.status,errorText);
			},
			success: function (data, status, xhr) {
				var type = xhr.getResponseHeader("Content-Type");
				successCallback(data, type);
			},
		};
	
		if (customHeaders !== undefined && customHeaders !== null) {
			$.extend(ajaxObj.headers, customHeaders);
		}
		
		return $.ajax(ajaxObj);
	};

	var isAnonymous = function(){
		if (oidc_userinfo !== undefined){
			return false;
		} else {
			return true;
		}
	};

	var useAuthentication = function(rurl){
    if(rurl.indexOf("\?") > 0){ 
            rurl += "&access_token=" + window.localStorage["access_token"];
        } else {
            rurl += "?access_token=" + window.localStorage["access_token"];
        }
        return rurl;
    };

	return {
		getServiceEndPoint : getServiceEndPoint,
		setServiceEndPoint : setServiceEndPoint,
		getAll : getAll,
		getAllSimple : getAllSimple,
		getOne : getOne,
		postOneWithJSON : postOneWithJSON, 
		putOneWithJSON : putOneWithJSON,
		postOneWithFormData : postOneWithFormData,
		putOneWithFormData : putOneWithFormData,
		deleteOne : deleteOne,
		isAnonymous : isAnonymous,
		useAuthentication : useAuthentication
	}

}();


GFramework.prototype.getApplicationId = function(){
    return this._appId;
}
GFramework.prototype.getMemberId = function(){
    return this._memberId;
}
GFramework.prototype.getServiceEndPoint = function(){
    return this.util.getServiceEndPoint();
}
GFramework.prototype.setApplicationId = function(appId){
    this.setServiceEndPoint(appId);
}
GFramework.prototype.setMemberId = function(memberId){
    this._memberId = memberId;
}

GFramework.prototype.getAllData = function(type, successCallback, errorCallback,options){
	var endPointURL = "gamification/"+type+"/"+this._appId;
	this.util.getAll(endPointURL,successCallback, errorCallback, options);
};
	
GFramework.prototype.getDataWithId = function(type,id,successCallback, errorCallback){
	//currentAppId = window.localStorage["appid"];
	var endPointURL = "gamification/"+type+"/"+this._appId+"/"+id;
	this.util.getOne(endPointURL,successCallback, errorCallback);
};
GFramework.prototype.createNewData = function(type,content,successCallback, errorCallback){
	//currentAppId = window.localStorage["appid"];
	var endPointURL = "gamification/"+type+"/"+this._appId;
	if(type === "quests"){
		this.util.postOneWithJSON(endPointURL, content,successCallback, errorCallback);
	}
	else{
		this.util.postOneWithFormData(endPointURL, content,successCallback, errorCallback);
	}
};

GFramework.prototype.updateData = function(type,id,content,successCallback, errorCallback){
	//currentAppId = window.localStorage["appid"];
	var endPointURL = "gamification/"+type+"/"+this._appId+"/"+id;
	if(type === "quests"){
		this.util.putOneWithJSON(endPointURL, content,successCallback, errorCallback);
	}
	else{
	this.util.putOneWithFormData(endPointURL,content,successCallback, errorCallback);
	}
};

GFramework.prototype.deleteData = function(type,id,successCallback, errorCallback){
	//currentAppId =window.localStorage["appid"];
	var endPointURL = "gamification/"+type+"/"+this._appId+"/" + id;
	this.util.deleteOne(endPointURL,successCallback, errorCallback);
};

GFramework.prototype.getBadgeImage = function(badgeid){
	//currentAppId = window.localStorage["appid"];
	if(!this.util.isAnonymous()){
		console.log("Authenticated request");
		var rurl = this.util.getServiceEndPoint() + "gamification/badges/"+this._appId+"/" + badgeid + "/img";
		return useAuthentication(rurl);
	} else {
		console.log("Anonymous request... ");
		return null;
	}
};

// Visualization
GFramework.prototype.getMemberStatus = function(successCallback, errorCallback){
	var endPointURL = "visualization/status/"+this._appId+"/"+this._memberId;
	this.util.getAllSimple(endPointURL,successCallback, errorCallback);
};
GFramework.prototype.getAllBadgesOfMember = function(successCallback, errorCallback){
	var endPointURL = "visualization/badges/"+this._appId+"/"+this._memberId;
	this.util.getAllSimple(endPointURL,successCallback, errorCallback);
};
GFramework.prototype.getAllAchievementsOfMember = function(successCallback, errorCallback){
	var endPointURL = "visualization/achievements/"+this._appId+"/"+this._memberId;
	this.util.getAllSimple(endPointURL,successCallback, errorCallback);
};
// COMPLETED, REVEALED, ALL
GFramework.prototype.getAllQuestWithStatusOfMember = function(questStatus, successCallback, errorCallback){
	var endPointURL = "visualization/quests/"+this._appId+"/"+this._memberId+"/status/"+questStatus;
	this.util.getAllSimple(endPointURL,successCallback, errorCallback);
};

GFramework.prototype.getOneQuestProgressOfMember = function(questId, successCallback, errorCallback){
	var endPointURL = "visualization/quests/"+this._appId+"/"+this._memberId+"/progress/"+questId;
	return this.util.getAllSimple(endPointURL,successCallback, errorCallback);
};

GFramework.prototype.getOneBadgeDetailOfMember = function(badgeId, successCallback, errorCallback){
	var endPointURL = "visualization/badges/"+this._appId+"/"+this._memberId+"/"+badgeId;
	this.util.getAllSimple(endPointURL,successCallback, errorCallback);
};
GFramework.prototype.getOneQuestDetailOfMember = function(questId, successCallback, errorCallback){
	var endPointURL = "visualization/quests/"+this._appId+"/"+this._memberId+"/"+questId;
	this.util.getAllSimple(endPointURL,successCallback, errorCallback);
};
GFramework.prototype.getOneAchievementDetailOfMember = function(achievementId, successCallback, errorCallback){
	var endPointURL = "visualization/achievements/"+this._appId+"/"+this._memberId+"/"+achievementId;
	this.util.getAllSimple(endPointURL,successCallback, errorCallback);
};
GFramework.prototype.triggerAction = function(actionid,successCallback, errorCallback){
	var endPointURL =  "visualization/actions/"+this._appId+"/"+actionid+"/"+this._memberId;
	this.util.sendRequest(
	    "POST",
	    endPointURL,
	    "",
	    "application/json",
	    {},
	    function(data, type){
	        console.log("trigger success");
			successCallback(data,type);
	        return false;
	    },
	    function(status,error) {
			errorCallback(status,error);
	        console.log("trigger failed");
	        return false;
	    }
	);
}