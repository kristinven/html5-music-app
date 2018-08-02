var $ = window.Zepto;
var root = window.player;
var $scope = $(document.body);
var songList;
var controlmanager;
var audio = new root.audioManager();
var curDuration;
// 绑定点击事件
function bindClick() {
    $scope.on('player:change', function(event, index) {
        curDuration = songList[index].duration;
        root.render(songList[index]);
        root.processor.renderAllTime(songList[index].duration);
        root.processor.updata(0);
        root.lrcManager.renderLrc(songList[index].lrc);
        audio.setAudioSource(songList[index].audio);
        if(audio.status == 'play') {
            audio.play();
            root.processor.start();
            root.lrcManager.start();
        }
        root.playList.signSong(index);
    });

    $scope.on('click', '.prev-btn', function() {
        var index = controlmanager.prev();
        $scope.trigger('player:change', index);
    });
    $scope.on('click', '.next-btn', function() {
        var index = controlmanager.next();
        $scope.trigger('player:change', index);
    });
    $scope.on('click', '.play-btn', function() {
        if(audio.status == 'play') {
            audio.pause();
            root.processor.stop();
            root.lrcManager.stop();
        }else {
            audio.play();
            root.processor.start();
            root.lrcManager.start();
        }
        $(this).toggleClass('playing');
    });
    var topOffset = $scope.find('.pro-wrapper').offset();
    var left = topOffset.left;
    var width = topOffset.width;
    $scope.on('click', '.pro-wrapper', function(e) {
        var x = e.clientX - left;
        var percent = x / width;
        var duration = percent * curDuration;
        root.processor.updata(percent);
        root.lrcManager.jumpToShow(duration);
        audio.jumpToPlay(duration);

        if(audio.status == 'play') {
            root.processor.start(percent);
            root.lrcManager.start();
        }
    });
    $scope.on('click', '.list-btn', function() {
        root.playList.show();
    });
    $scope.find('.play-list').on('click', 'li', function(){
        var index = $(this).index();
        controlmanager.setIndex(index);

        audio.status = 'play';
        $scope.trigger('player:change', index);
        root.playList.signSong(index);
        $scope.find('.play-btn').addClass('playing');
        
        setTimeout(function() {
            root.playList.hide();
        }, 350);
    });
    $scope.find('.play-list').on('click', '.close-btn', function() {
        root.playList.hide();
    });
    
}
// 绑定触摸事件
function bindTouch() {
    var topOffset = $scope.find('.pro-wrapper').offset();
    var left = topOffset.left;
    var width = topOffset.width;
    $scope.find('.slider-point').on('touchstart', function() {
        root.processor.stop();
        root.lrcManager.stop();
    }).on('touchmove', function(e) {
        var x = e.changedTouches[0].clientX - left;
        var percent = x / width;
        if(percent < 0) {
           percent = 0; 
        }else if(percent > 1) {
            percent = 1;
        }
        root.processor.updata(percent);
    }).on('touchend', function(e) {
        var x = e.changedTouches[0].clientX - left;
        var percent = x / width;
        var rightTime = percent * curDuration;
        if(percent < 0) {
            percent = 0; 
        }else if(percent > 1) {
            percent = 1;
        }
        audio.jumpToPlay(rightTime);
        root.lrcManager.jumpToShow(rightTime);

        if(audio.status == 'play') {
            root.processor.start(percent);
            root.lrcManager.start();
        }
    })
}
// 获取数据
function getData(url) {
    $.ajax({
        type: 'GET',
        url: url,
        success: function(data) {
            root.playList.createList(data);
            bindClick();
            bindTouch();
            songList = data;
            controlmanager = new root.controlManager(data.length);
            $scope.trigger('player:change', 0);
        },
        error: function() {
            console.log('error');
        }
    })
}

getData('/mock/data-lrc.json');
