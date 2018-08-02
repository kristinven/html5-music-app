(function($, root){
    var $scope = $(document.body);

    // 渲染歌曲信息
    function renderInfo(data) {
        var html = '<div class="song-name">' + data.song + '</div>' + 
                   '<div class="singer">' + data.singer + '</div>' +
                   '<div class="album">' + data.album + '</div>';
        $scope.find('.song-info').html(html);
    }
    // 渲染wrapper背景和song-img图片
    function renderImg(src) {
        var img = new Image();
        img.src = src;
        img.onload = function() {
            root.blurImg(img, $scope.find('.wrapper'));
            $scope.find('.song-img img').attr('src', src);
        }
    }
    // 渲染是否喜欢按钮
    function renderIsLike(isLike) {
        if(isLike) {
            $scope.find('.control .like-btn').addClass('liking');
        }else {
            $scope.find('.control .like-btn').removeClass('liking');
        }
    }

    // 渲染
    function render(data) {
        renderInfo(data);
        renderImg(data.image);
        renderIsLike(data.isLike);
    }

    root.render = render;

})(window.Zepto, window.player || (window.player = {}));