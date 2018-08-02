(function($, root) {
    var $scope = $(document.body);
    // 根据接收到的数据创建播放列表
    function createList(data) {
        var $playList = $('<div class="play-list">' +
        '<div class="title">播放列表</div>' +
        '<ul></ul>' +
        '<div class="close-btn">关闭</div>' +
        '</div>');
        var html = '';
        data.forEach(function(ele, index) {
            html += '<li>' + ele.song + '<span> - ' + ele.singer + '</span></li>';
        });
        $playList.find('ul').html(html);
        $scope.find('.wrapper').append($playList);
    }

    // 把当前歌曲标记，显示成红色
    function signSong(index) {
        $scope.find('.sign').removeClass('sign');
        $scope.find('.play-list li').eq(index).addClass('sign');
    }

    // 显示播放列表
    function show() {
        $scope.find('.play-list').addClass('show');
    }

    // 隐藏播放列表
    function hide() {
        $scope.find('.play-list').removeClass('show');
    }
    root.playList = {
        createList : createList,
        signSong : signSong,
        show : show,
        hide : hide
    }

})(window.Zepto, window.player || (window.player = {}));