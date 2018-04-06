(function($,root){
    var $scope = $(document.body);
    var curDuration;
    var frameId;

    var startTime;
    var lastPrecent = 0;
    function formatTime(duration){//把秒转换成分和秒
        duration = Math.floor(duration);
         var minute = Math.floor(duration / 60);
         var second = duration - minute * 60;
         if(minute < 10){
            minute = "0" + minute;
         }
         if(second < 10){
            second = "0" + second;
         }
         return minute + ":" + second;
    }
    function renderAllTime(duration){
        lastPrecent = 0;
        curDuration = duration;
    	var allTime = formatTime(duration);
        $scope.find(".all-time").html(allTime);
    }
    function update(precent){
         var curTime = precent * curDuration;
         curTime = formatTime(curTime);
         $scope.find(".cur-time").html(curTime);
         var precentage = (precent - 1) * 100 + "%";
         $scope.find(".pro-top").css({
            transform : "translateX("+precentage+")"
         });
         scrollLrc(precent);
    }
    function start(precentage){
        lastPrecent = precentage == undefined ? lastPrecent : precentage;
        cancelAnimationFrame(frameId);
        startTime = new Date().getTime();
        function frame(){
            var curTime = new Date().getTime();
            var precent = lastPrecent + (curTime - startTime) / (curDuration * 1000);
            if (precent < 1){
                frameId = requestAnimationFrame(frame);
                update(precent);
                
            }else{
                cancelAnimationFrame(frameId);
            }
        }
        frame();
        
    }
    function stop(){
        var stopTime = new Date().getTime();
        lastPrecent = lastPrecent + (stopTime - startTime)/(curDuration * 1000);
        cancelAnimationFrame(frameId);
        
    }
    root.processor = {
        renderAllTime : renderAllTime,
        start : start,
        stop : stop,
        update : update
    }

    


     function formatTime2(duration){//把分和秒转换成毫秒
        
        return parseInt(duration.split(":")[0]) * 60 * 1000 + parseFloat(duration.split(":")[1]) * 1000;

    }
       //歌词滚动
    function scrollLrc(precent){
            
        root.lrcc.lrcTime.forEach(function (item,index) {
            var diff = formatTime2(item) - curDuration * 1000 * precent;
                if ( diff > 200 && diff < 220){

                    var lrcindex = -(index * 30) + "px";

                    $scope.find(".lrc ul").css({
                        transform : "translateY("+lrcindex+")"
                     })
                }

        })
    }






})(window.Zepto,window.player || (window.player = {}))