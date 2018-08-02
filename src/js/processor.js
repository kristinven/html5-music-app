(function($, root) {
    var $scope = $(document.body);
    var curDuration;
    var aniId;
    var lastPercent = 0;
    var startTime;
    // 把秒转换成分和秒
    function formatTime(duration) {
        var minute = Math.floor(duration / 60);
        var second = Math.round(duration % 60);
        if(minute < 10) {
            minute = '0' + minute;
        }
        if(second < 10) {
            second = '0' + second;
        }
        return minute + ':' + second;
    }

    function renderAllTime(duration) {
        curDuration = duration;
        var allTime = formatTime(duration);
        $scope.find('.all-time').html(allTime);
    }

    // 进度条开始走动。渲染进度条和当前时间
    function start(percent) {
        cancelAnimationFrame(aniId);
        lastPercent = percent !== undefined ? percent : lastPercent;
        startTime = new Date().getTime();
        function renderPro() {
            var curTime = new Date().getTime();
            var percent = lastPercent + (curTime - startTime) / (curDuration * 1000);
            $scope.find('.pro-top').css({
                'margin-left' : (percent - 1) * 100 + '%'
            })
            var newTime = formatTime(percent * curDuration);
            $scope.find('.cur-time').html(newTime);
            // 播放完后切换下一曲
            if(percent >= 1){
                cancelAnimationFrame(aniId);
                setTimeout(function() {
                    $scope.find('.next-btn').trigger('click');
                }, 500);
            }else{
                aniId = requestAnimationFrame(renderPro);
            }

        }
        renderPro();
    }

    // 进度条停止走动
    function stop() {
        var curTime = new Date().getTime();
        lastPercent = lastPercent + (curTime - startTime) / (curDuration * 1000);
        cancelAnimationFrame(aniId);
    }

    // 更新进度条和当前时间
    function updata(percent) {
        lastPercent = percent;
        $scope.find('.pro-top').css({
            'margin-left' : (percent - 1) * 100 + '%'
        });
        var newTime = formatTime(percent * curDuration);
        $scope.find('.cur-time').html(newTime);
    }

    

    root.processor = {
        renderAllTime : renderAllTime,
        start : start,
        stop : stop,
        updata : updata
    }
})(window.Zepto, window.player || (window.player = {}));