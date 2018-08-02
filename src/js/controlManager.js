(function($, root) {
    // 构造函数controlManager，统一管理index
    function controlManager(len) {
        this.index = 0;
        this.len = len;
    }
    
    // 获取前一个index值
    controlManager.prototype.prev = function() {
        return this.getIndex(-1);
    }
    // 获取后一个index值
    controlManager.prototype.next = function() {
        return this.getIndex(1);
    }
    // 获取index值
    controlManager.prototype.getIndex = function(val) {
        var index = this.index;
        var len = this.len;
        index = (index + val + len) % len;
        this.index = index;
        return index;
    }
    // 设置当前index值
    controlManager.prototype.setIndex = function(index) {
        if(index >= 0 && index < this.len) {
            this.index = index;
        }else {
            console.log('error!index is over scope.')
        }
    }
    root.controlManager = controlManager;

})(window.Zepto, window.player || (window.player = {}));