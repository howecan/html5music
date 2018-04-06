var $ = window.Zepto;
var root = window.player;
var $scope = $(document.body);
var index = 0;
var songList;
var controlmanager;
var audio = new root.audioManager();
function bindClick(){
	$scope.on("play:change",function(event,index,flag){
		audio.setAudioSource(songList[index].audio);
		root.renderlrc(songList[index]);
		if(audio.status == "play" || flag == true){
			audio.play();
			root.processor.start();
		}
		root.processor.renderAllTime(songList[index].duration);
		root.render(songList[index]);
		root.processor.update(0);
		console.log(songList[index].audio);
	})
	$scope.bind("click",".prev-btn",function(){
		var index = controlmanager.prev();
		$scope.trigger("play:change",index);
	})
	$scope.bind("click",".next-btn",function(){
		var index = controlmanager.next();
		$scope.trigger("play:change",index);
	})
	$scope.on("click",".play-btn",function(){
		if(audio.status == "play"){
			audio.pause();
			root.processor.stop();
		}else{
			root.processor.start();
			audio.play();
		}
		$(this).toggleClass("playing");
	})
}
function bindTouch(){
	var $slidePoint = $scope.find(".slide-pointer");
	var offset =$scope.find(".pro-wrapper").offset();
	var left = offset.left;
	var width = offset.width;
	//绑定拖拽事件 开始拖拽
	$slidePoint.on("touchstart",function(){
		root.processor.stop();
	}).on("touchmove",function(e){
            var x = e.changedTouches[0].clientX;
            var percent = (x - left)/width;
            if(percent > 1 || percent < 0){
            	percent = 0;
            }
            root.processor.update(percent);
	}).on("touchend",function(e){
		var x = e.changedTouches[0].clientX;
		var percent = (x - left)/width;
            if(percent > 1 || percent < 0){
            	percent = 0;
            }
            var curDuration = songList[controlmanager.index].duration;
            var curTime = curDuration * percent;
            console.log(curDuration);
            audio.jumpToplay(curTime);
            root.processor.start(percent);
            $scope.find(".play-btn").addClass("playing");
	})
	$scope.on("click",".list-btn",function(){
		root.playList.show(controlmanager);
	});

}
function getData(url){
	$.ajax({
		type : "GET",
		url : url,
		success : function(data){
			songList = data;
			root.render(data[0]);
			root.playList.renderList(data);
			controlmanager = new root.controlManager(data.length);
			bindClick();
			bindTouch();
            $scope.trigger("play:change",0);
		},
		error : function(){
			consloe.log("error");
		}
	})

}

getData("../mock/data.json")