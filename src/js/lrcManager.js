(function($, root){
    var $scope = $(document.body);
    var $ul = $scope.find('.lrc ul');
    var aniId;
    var len;
    var startTime = 0, lastTime = 0;
    var index = 0, lastIndex = 0;
    var timeArr;
    // 渲染当前歌曲歌词, 初始化歌词面板
    function renderLrc(lrc) {
        var words = lrc.words;
        var html = '';
        timeArr = lrc.time;
        index = 0;
        lastIndex = 0;
        startTime = 0;
        lastTime = 0;
        len = words.length;
        words.forEach(function(ele, index) {
            if(index == 0) {
                html += '<li class="cur">' + ele + '</li>';
            }else {
                html += '<li>' + ele + '</li>';
            }
        })
        $ul.css({
            top: 0
        })
        $ul.html(html);
    }

    // 把秒转换成带分和秒格式，秒位带两位小数
    function formatTime(time) {
        var minute = Math.floor(time / 60);
        var second = (time % 60).toFixed(2);
        if(minute < 10) {
            minute = '0' + minute;
        }
        if(second < 10) {
            second = '0' + second;
        }
        return minute + ':' + second;
    }

    // 高亮显示歌词
    function changeShowingLrc(index) {
        $ul.find('li').removeClass('cur');
        $ul.find('li').eq(index).addClass('cur');
        var offsetY;
        if(index <= 2) {
            offsetY = 0;
        }else if(index > 2 && index < len - 3) {
            offsetY = - 22 * (index - 2);
        }else if(index >= len -3) {
            offsetY = -22 * (len - 6);
        }
        $ul.css({
            top : offsetY
        })
    }
    
    // 歌词开始滚动
    function start() {
        cancelAnimationFrame(aniId);
        startTime = new Date().getTime();
        function wordSlider() {
            var curTime = new Date().getTime();
            var rightMoment = formatTime((curTime - startTime + lastTime) / 1000);
            if(rightMoment >= timeArr[index] && rightMoment < timeArr[index + 1]) {
                changeShowingLrc(index);
                index ++;
            }
            if(rightMoment >= timeArr[len - 1]) {
                index = len - 1;
                changeShowingLrc(index);
                cancelAnimationFrame(aniId);
                // console.log('end');
            }else {
                aniId = requestAnimationFrame(wordSlider);
            }
        }
        wordSlider();
    }

    // 歌词停止滚动
    function stop() {
        var curTime = new Date().getTime();
        lastTime = lastTime + curTime - startTime;
        cancelAnimationFrame(aniId);
    }

    // 根据播放时间更新当前歌词序号
    function updata(duration) {
        var moment = formatTime(duration);
        var index = 0;
        for(var i = 0; i < len; i++) {
            if(moment >= timeArr[i] && moment < timeArr[i + 1]) {
                index = i;
                break;
            }
        }
        if(moment >= timeArr[len - 1]) {
            index = len - 1;
        }
        return index;
    }
    

    // 跳到某个时刻显示歌词
    function jumpToShow(duration) {
        lastTime = duration * 1000;
        index = updata(duration);
        changeShowingLrc(index);
    }

    root.lrcManager = {
        renderLrc : renderLrc,
        start : start,
        stop : stop,
        jumpToShow : jumpToShow
    }

})(window.Zepto, window.player || (window.player = {}))