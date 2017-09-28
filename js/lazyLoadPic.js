/*
 * @Author: Ghost.liu 
 * @Date: 2017-09-27 20:00:15 
 * @Last Modified by: Ghost.liu
 * @Last Modified time: 2017-09-28 14:05:59
 */

; (function (win, $) {
    var _winHeight = win.screen.height,

        doc = win.document,
        defaultOption = {
            //用于缓存节点,避免重复查询
            targets: [],
            className: "lazyload",
            threshold: 0,               // 提前加载
            parentName: doc.body,
            direction: 'v',
            defaultPic: "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
        }
    win.lazyLoadPic = function (option) {
        this.option = $.extend({}, defaultOption, option);
        this.init();
    }
    lazyLoadPic.prototype.init = function () {
        // targets = []
        var that = this,
            targets = doc.querySelectorAll('.' + that.option.className);
        this.option.targets = [];
        for (var i = 0, length = targets.length; i < length; i++)
            this.option.targets.push(targets[i]);
        //滚动body
        if (this.option.parentName === doc.body) {
            win.addEventListener('scroll', function () {
                _lazyLoad(that);
            });
        } else {
            var parents = doc.querySelectorAll('.' + this.option.parentName);
            for (var j = 0, length = parents.length; j < length; j++) {
                var parent = parents[j];
                that.parentOffsetTop = parent.getBoundingClientRect().top;
                that.parentHeight = parent.clientHeight;
                win.addEventListener('scroll', function () {
                    _lazyLoad(that);
                });
                parent.addEventListener('scroll', function () {
                    _lazyLoad(that);
                });
            };
        }
        _lazyLoad(this);
    }
    function _lazyLoad(that) {
        var option = that.option;
        option.targets.forEach(function (target, index, targets) {
            if (!target) return;
            // console.log(target.id);
            var _targetTop = target.getBoundingClientRect().top,
                // _targetLeft = target.getBoundingClientRect().left,
                _src = target.getAttribute('data-original');
            if (!_src) return;
            //如果是在body上
            if (option.parentName === doc.body) {
                if (_targetTop - option.threshold <= _winHeight) {
                    _loadImg();
                }
            }
            //如果是垂直方向的容器
            else if (that.option.direction === 'v') {
                if ((_targetTop <= _winHeight) && (_targetTop - that.parentOffsetTop - option.threshold <= that.parentHeight)) {
                    _loadImg();
                }
            }
            function _loadImg() {
                if (target.nodeName === 'IMG') {
                    target.setAttribute('src', _src);
                    //如果加载失败则放置默认图片
                    target.onerror = function () {
                        this.setAttribute('src', option.defaultPic)
                    }
                } else {
                    target.style.backgroundImage = 'url(' + _src + ')';
                    // target.style.backgroundImage = 'url(' + _src + '),'+'url(' + option.defaultPic + ')';
                }
                target.removeAttribute('data-original');
                //已加载好的节点就不用再进行加载了
                [].splice.call(targets, index, 1, undefined);
            }
        }, this);
        //对空数据进行过滤
        option.targets = option.targets.filter(function(target){
            return target !== undefined && target != null;
        });
    }
})(window, window.Zepto || window.jQuery)


