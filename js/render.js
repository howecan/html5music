(function($,root){
	var $scope = $(document.body);
    var lrcTime = [];
    var lrcWord = '';
    
	//渲染这首歌的信息
    function renderInfo(info){
    	var html = '<div class="song-name">'+ info.song +'</div>'+
	     '<div class="singer-name">'+ info.singer +'</div>' +
	     '<div class="album-name">'+ info.album +'</div>';
	     $scope.find(".song-info").html(html);
    }
 

    //渲染这首歌的图片
    function renderImg(src){
    	var img = new Image();
    	img.onload = function(){
    		root.blurImg(img,$scope);
    		$scope.find(".song-img img").attr("src",src)
    	}
    	img.src = src;
    }

    //渲染这首歌的喜欢
   function renderIslike(isLike){
   	if(isLike){
   		$scope.find(".like-btn").addClass("liking")
   	}else{
   		$scope.find(".like-btn").removeClass("liking")
   	}
   }

       //渲染这首歌的歌词
    function renderlrc(info){
        var lrcurl = info.lrc;
        $.ajax({
            type : "GET",
            contentType : "application/x-www-form-urlencoded; charset=UTF-8",
            url : lrcurl,
            success : function(data){
                var lrcList = data;
                lrcListArr = lrcList.split("[");
                var len = lrcListArr.length;

                lrcTime =[];
                lrcWord ="";
                for(var i = 0 ;i < len; i++){
                    (function(j){
                        lrcTime.push(lrcListArr[j].split("]")[0]);
                        if(j>0){
                        lrcWord += "<li>"+lrcListArr[j].split("]")[1]+"</li>";
                        }
                    })(i)
                };
                lrcTime.shift();
                root.lrcc = {
					lrcTime:lrcTime,
					lrcWord:lrcWord
				}
                $scope.find(".lrc ul").html(lrcWord);
            

            },
            error : function(){
                consloe.log("no lrc");
            }
        })


    }


	root.renderlrc = renderlrc;
	

    root.render = function(data){
	renderInfo(data);
	renderlrc(data);
	renderImg(data.image);
	renderIslike(data.isLike);
    }
})(window.Zepto,window.player || (window.player = {}))