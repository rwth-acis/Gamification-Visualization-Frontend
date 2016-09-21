
var memberId, currentAppId;
var epURL = "http://gaudi.informatik.rwth-aachen.de:8081/";
var GF, iwcClient;


function useAuthentication(rurl){
    if(rurl.indexOf("\?") > 0){ 
        rurl += "&access_token=" + window.localStorage["access_token"];
    } else {
        rurl += "?access_token=" + window.localStorage["access_token"];
    }
    return rurl;
}

function getBadgeImage(badgeId){
    var endPoint = epURL + "visualization/badges/" + currentAppId + "/" + memberId + "/" + badgeId + "/img";
    return useAuthentication(endPoint);
}

var renderError = function(error, element, message){
    var e = JSON.parse(error);
    element.html(message + " " + e.message);
};

var QuestVisualization = (function(){
	
	var questElement;
	var load = function(){
		var completedQuests, revealedQuests;
		questElement = $("#quest-row-container");
		GF.getAllQuestWithStatusOfMember(
			"ALL",
			function(data,status){
				console.log(data);
				completedQuests = _.filter(data,{"status": 'COMPLETED'});
				revealedQuests = _.filter(data,{"status": 'REVEALED'});
				console.log(completedQuests);
				console.log(revealedQuests);
				renderCompletedQuest(completedQuests);
				renderRevealedQuest(revealedQuests);
			},
			function(error, errStatus){
                renderError(errStatus,questElement,"Error cannot contact the server.");
			});
	};
	var renderCompletedQuest=function (completedQuests) {
		var questCompletedElement = questElement.find('#quest-completed');
		questCompletedElement.empty();
		var tmpl = _.template($("#questCompletedTemplate").html());
		var htmlData = "";
        _.forEach(completedQuests,function(v){
	        htmlData += tmpl(v);
	        // this.$el.prop('id',this.model.get("id"));
        });
        questCompletedElement.append(htmlData);
       
    };

    var renderRevealedQuest=function (revealedQuests) {
		var questRevealedElement = questElement.find('#quest-revealed');
		questRevealedElement.empty();
		var tmpl = _.template($("#questRevealedTemplate").html());
		var tmplProgress = _.template($("#questProgressTemplate").html());
		var htmlData = "";
		var promises = [];
		 _.forEach(revealedQuests,function(v){
		 	GF.getOneQuestProgressOfMember(
		 		v.id,
		 		function(data,status){
		 			console.log(data);
					//htmlData += tmpl(data);
		 			questRevealedElement.append(tmpl(v));
                    var oneQuestRevealedEl = questRevealedElement.find("#"+v.id).find(".panel-body");
                    oneQuestRevealedEl.append(tmplProgress(data));
                    _.forEach(data.actionArray,function(v){
                        oneQuestRevealedEl.find('#'+v.action).circleProgress({
                            value: v.times/v.maxTimes,
                            size: 70,
                            thickness: 10,
                            fill: {
                               gradient: [['#0681c4', .5], ['#4ac5f8', .5]], 
                               gradientAngle: Math.PI / 8
                            }
                        }).on('circle-animation-progress', function(e, p, v) {
                            var $this = $(this),
                                instance = $this.data('circle-progress'),
                                size = instance.size,
                                thickness = instance.getThickness(),
                                radius = size / 2 - thickness / 2,
                                angle = 2 * v * Math.PI + instance.startAngle,
                                x = radius * Math.cos(angle),
                                y = radius * Math.sin(angle);
                                
                            // $this.find('.label').css({
                            //     left: (x + size / 2),
                            //     top: y + size / 2 
                            // });
                                if(v == 1){
                                    $this.find('.label').removeClass('hidden');
                                }
                                else{
                                    $this.find('.label').addClass('hidden');
                                }

                            //$this.find('.label').html(parseInt(100 * p) + '<i>%</i>');
                        });
                    });
                    
		 		},
		 		function(error,errStatus){
                    renderError(errStatus,questRevealedElement,"Error cannot contact the server.");
		 		}
		 	);
        });
    };


	return {
		load : load
	};
})();

var BadgeVisualization = (function(){
	
	var badgeElement;
	var load = function(){
		badgeElement = $("#badge-row-container");
		GF.getAllBadgesOfMember(
			function(data,status){
				console.log(data);
				renderBadges(data);
			},
			function(error,errStatus){
                renderError(errStatus,badgeElement,"Error cannot contact the server.");
			});
	};
	var renderBadges=function (badges) {

        var tmpl = _.template($("#badgeTemplate").html()); 
        badgeElement.empty();
		
		var htmlData = "";
        _.forEach(badges,function(v){
	        htmlData += tmpl(v);
	        // this.$el.prop('id',this.model.get("id"));
        });
        badgeElement.append(htmlData);
       
    };

    // var registerListener = function(){
    // 	badgeElement.on("click","img",function(e){
    // 	//show modal
    //     var tmpl = _.template($("#badgeModal").html());
    //     $('#badgeimagemodal').find('.modal-body').html(tmpl(this.model.toJSON()));
    //     $('#badgeimagemodal').modal('toggle');
    // 	});
    // };

	return {
		load : load
	};
})();


var AchievementVisualization = (function(){
	
	var achievementElement;
	var load = function(){
		achievementElement = $(".achievement-row-container");
		GF.getAllAchievementsOfMember(
			function(data,status){
				console.log(data);
				renderAchievements(data);
			},
			function(error,errStatus){
                renderError(errStatus,achievementElement,"Error cannot contact the server.");
			});
	};
	var renderAchievements=function (achievements) {

        var tmpl = _.template($("#achievementTemplate").html()); 
        achievementElement.empty();
		
		var htmlData = "";
        _.forEach(achievements,function(v){
	        htmlData += tmpl(v);
	        // this.$el.prop('id',this.model.get("id"));
        });
        achievementElement.append(htmlData);
       
    };
	return {
		load : load
	};
})();

var MemberStatusVisualization = (function(){
	
	var memberStatusElement;
	var load = function(){
		memberStatusElement = $("#user-main-status");
		GF.getMemberStatus(
			function(data,status){
				data.userName = memberId;
				console.log(data);
				renderMemberStatus(data);
			},
			function(error, errStatus){
                renderError(errStatus,memberStatusElement,"Error cannot contact the server.");
			});
	};
	var renderMemberStatus=function (data) {
        data.appIdText = currentAppId;
        var tmpl = _.template($("#memberStatusTemplate").html()); 
        memberStatusElement.empty();

        memberStatusElement.append(tmpl(data));
		//$('.circle').circleProgress();
		$('#memberStatusProgress').circleProgress({
		    value: data.progress/100.0,
		    size: 130,
		    thickness: 18,
		    fill: {
		        image: 'http://i.imgur.com/seDoWGK.png'
		    }
		}).on('circle-animation-progress', function(e, p, v) {
		    var $this = $(this),
		        instance = $this.data('circle-progress'),
		        size = instance.size,
		        thickness = instance.getThickness(),
		        radius = size / 2 - thickness / 2,
		        angle = 2 * v * Math.PI + instance.startAngle,
		        x = radius * Math.cos(angle),
		        y = radius * Math.sin(angle);

            if(v < 0.25 || v > 0.75){
                $this.find('.label').css({
                    left: (x + size / 2) - 30,
                    top: y + size / 2 
                });                
            }else{
                 $this.find('.label').css({
                    left: x + size / 2,
                    top: y + size / 2 
                });
            }


		    //$this.find('.label').html(parseInt(100 * v) + '<i>%</i>');
		});
        if(data.nextLevelPoint == null){
            $('#memberStatusProgress').find('.label').html(data.memberPoint+" / - ");
        }else{
            $('#memberStatusProgress').find('.label').html(data.memberPoint+" / "+data.nextLevelPoint);
        }
       
    };
	return {
		load : load
	};
})();


var localLeaderboard = function(tableElement,objectFormatters, loadedHandler,callbackResponse){ 
    var endPoint = epURL + "visualization/leaderboard/local/" + currentAppId + "/" + memberId;
    $(tableElement).bootgrid("destroy");
    var objectgrid = $(tableElement).bootgrid({
            ajax: true,
            ajaxSettings: {
                method: "GET",
                cache: false
            },
            searchSettings: {
                delay: 100,
                characters: 3
            },
            url: useAuthentication(endPoint),
            formatters: objectFormatters,
            responseHandler: function(response){
                callbackResponse(response);
                return response;
            }
        }).on("loaded.rs.jquery.bootgrid", function()
        {
            /* Executes after data is loaded and rendered */
            loadedHandler(objectgrid);
            
        });
}

var globalLeaderboard = function(tableElement,objectFormatters, loadedHandler,callbackResponse){ 
    var endPoint = epURL + "visualization/leaderboard/global/" + currentAppId + "/" + memberId;
    $(tableElement).bootgrid("destroy");
    var objectgrid = $(tableElement).bootgrid({
            ajax: true,
            ajaxSettings: {
                method: "GET",
                cache: false
            },
            searchSettings: {
                delay: 100,
                characters: 3
            },
            url: useAuthentication(endPoint),
            formatters: objectFormatters,
            responseHandler: function(response){
                callbackResponse(response);
                return response;
            }
        }).on("loaded.rs.jquery.bootgrid", function()
        {
            /* Executes after data is loaded and rendered */
            loadedHandler(objectgrid);
            
        });
}

function reloadActiveTab(){
    //reload active tab
    var $link = $('li.active a[data-toggle="tab"]');
    $link.parent().removeClass('active');
    var tabLink = $link.attr('href');
    $('#vistabs a[href="' + tabLink + '"]').tab('show');
}


var init = function() {
    iwcClient = new iwc.Client();
  var iwcCallback = function(intent) {
    console.log(intent);
    if(intent.action == "REFRESH_APPID"){
       //setAppIDContext(intent.data);
       currentAppId = intent.data;
       //GF  = new GFramework(currentAppId,memberId, epURL);
       checkAppId();
    }    

    if(intent.action == "OPEN_NOTIFICATION"){
        $("#modalnotif").find(".modal-body").empty();
        var notif_data = JSON.parse(intent.data);
        var notif_data_html = "<div class=\"container\">";
        console.log(notif_data);
        for (i = 0; i < notif_data.length; i++){
            notif_data_html += "<div class=\"text-center\"><font color=\"green\">"+notif_data[i].type+"</font> <font color=\"blue\">"+notif_data[i].typeId+"</font> : " + notif_data[i].message;
            if(notif_data[i].type=="BADGE"){
                notif_data_html += "</div><div class=\"text-center\"><img class=\"center-block\" src="+getBadgeImage(notif_data[i].typeId)+" style=\"display: block;max-width:50px;max-height:50px;width: auto;height: auto;\"/></div><br>";
            }
            else{
                notif_data_html += "</div>";
            }
        }
        notif_data_html += "</div>";
        $("#modalnotif").find(".modal-body").append(notif_data_html);

        $("#modalnotif").modal('show');
    }    
    
    if(intent.action == "REFRESH_TAB"){
        reloadActiveTab();
    }

   
  };
  iwcClient.connect(iwcCallback);
  //client = new Las2peerWidgetLibrary(epURL, iwcCallback);
 //notification = new gadgets.MiniMessage("GAMEBADGE");

    //currentAppId = "test";
    //memberId = "user1";
    console.log(currentAppId);
    console.log(memberId);
    $('#sidebar').find('a#refreshbutton').click(function(e) {
        e.preventDefault();
        console.log("Click refresh");
        sendIntentFetchAppId();
    });
    
    checkAppId();
   

    reloadActiveTab();
    
    $('a[data-toggle="tab"]').on('shown.bs.tab', function(e){
        var currentTab = $(e.target).prop("title"); // get current tab
        switch(currentTab){
            case "Home":MemberStatusVisualization.load();
            break;
            case "Badge":BadgeVisualization.load();
            break;
            case "Quest":QuestVisualization.load();
            break;
            case "Achievement":AchievementVisualization.load();
            break;
            case "Local leaderboard":
                localLeaderboard(
                    $('table#list_local_leaderboard'),
                    {},
                    function(objectgrid){},
                    function(response){console.log(response.rows)}
                );
            break;
            case "Global leaderboard":
                globalLeaderboard(
                    $('table#list_global_leaderboard'),
                    {},
                    function(objectgrid){},
                    function(response){console.log(response.rows)}
                );
            break;
        }
        console.log(currentTab);
        var LastTab = $(e.relatedTarget).text(); // get last tab
        $(".current-tab span").html(currentTab); 
        $(".last-tab span").html(LastTab);
    });
        


    $("button#triggeraction").on("click", function() {
        var actionId = $("input#triggeraction").val();
        var endPointURL =  "visualization/actions/"+currentAppId+"/"+actionId+"/"+memberId;
        GF.util.sendRequest(
            "POST",
            endPointURL,
            "",
            "application/json",
            {},
            function(data, type){
                console.log("trigger success");
                
                return false;
            },
            function(status,error) {

                console.log("trigger failed");
                return false;
            }
        );
    });

  $('#sidebar').find('a#refreshbutton').click(function(e) {
     e.preventDefault();
     sendIntentFetchAppId();
  });
}

function checkAppId(){
     if(currentAppId){
        $('#container-text').prop('hidden',true);
        $('#vis_container').prop('hidden',false)
        GF  = new GFramework(currentAppId,memberId, epURL);
       
       MemberStatusVisualization.load();
       $("#appidtext").html(currentAppId);
    }else{
        $('#vis_container').prop('hidden',true);

        $('#container-text').html('<h3>App ID is not found. Try to refresh the widget.</h3>');
        $('#container-text').prop('hidden',false);
    }

}

function sendIntentFetchAppId(){
    var intent = {
      "component": "",
      "data": "",
      "dataType": "text/xml",
      "action": "FETCH_APPID",
      "categories": ["", ""],
      "flags": [void 0],
      "extras": {}
    };
    iwcClient.publish(intent);
}

function signInCallback(result) {
    if(result === "success"){
        
        memberId = oidc_userinfo.preferred_username;
        // after successful sign in, display a welcome string for the user
        $("#status").html("Hello, " + memberId + "!");

        init();
    } else {
        // if sign in was not successful, log the cause of the error on the console

        console.log(result);
    }
    if(result === "success"){
        $('#container-text').remove('hidden',true);
        $('#vis_container').prop('hidden',false)
    }else{
        $('#container-text').prop('hidden',false);
        $('#vis_container').prop('hidden',true);
    }

}

$(document).ready(function() {
  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });
});