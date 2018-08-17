/**
 * @file dialog directive
 * @author zhangzengwei@baidu.com
 */
import './setScroll.less';

class SetScrollDirective {
    constructor() {
        this.restrict = 'EC';
        this.template = require('./setScroll.html');
        this.transclude = true;
        this.scope = {
        };
    }

    link(scope, element, attrs) {
        scope.scrollInfo = {
            show: false
        };
        let innerElem = $('.inner-ct', element);
        let scrollBarElem = $('.scroll-bar', element);
        let scrollUpElem = $('.scroll-up', scrollBarElem);
        let scrollDownElem = $('.scroll-down', scrollBarElem);
        let scrollTrackElem = $('.scroll-track', scrollBarElem);
        let scrollBtnElem = $('.scroll-btn', scrollTrackElem);
        // let elementBound = element[0].getBoundingClientRect();
        // let innerElemBound = innerElem[0].getBoundingClientRect();
        let scrollUpElemBound = scrollUpElem[0].getBoundingClientRect();
        let scrollDownElemBound = scrollDownElem[0].getBoundingClientRect();
        let scrollTrackElemBound = scrollTrackElem[0].getBoundingClientRect();
        let scrollBtnElemBound = scrollBtnElem[0].getBoundingClientRect();
        let scrollTop = scrollBtnElemBound.top - scrollTrackElemBound.top;
        let scrollBottom = scrollTrackElemBound.bottom - scrollBtnElemBound.bottom;

        let outerHeight = element[0].offsetHeight;
        let innerHeight = innerElem[0].offsetHeight;
        let scrollTrackHeight = scrollTrackElem[0].offsetHeight;
        let scrollBtnHeight = scrollBtnElem[0].offsetHeight;
        let maxScrollHeight = scrollTrackHeight - 20;
        // console.log('o:' + outerHeight);
        // console.log('i:' + innerHeight);
        let outInPercent = outerHeight / innerHeight;
        let scrollVOverPercent = null;
        if (outInPercent < 1) {
            let calScrollBtnHeight = scrollTrackHeight * outInPercent;
            if (calScrollBtnHeight > scrollBtnHeight) {
                scrollBtnHeight = calScrollBtnHeight;
            }
            scrollBtnElem.css({
                height: scrollBtnHeight + 'px'
            });
            maxScrollHeight = scrollTrackHeight - scrollBtnHeight;
            scrollVOverPercent = maxScrollHeight / (innerHeight - outerHeight);
            scope.scrollInfo.show = true;
        }
        
        let mouseOldPosY = null;
        let realMoveLength = null;
        let mousemoveBtn = (event) => {
            scrollTrackElemBound = scrollTrackElem[0].getBoundingClientRect();
            scrollBtnElemBound = scrollBtnElem[0].getBoundingClientRect();
            scrollTop = scrollBtnElemBound.top - scrollTrackElemBound.top;
            scrollBottom = scrollTrackElemBound.bottom - scrollBtnElemBound.bottom;
            let moveLength = event.pageY - mouseOldPosY;
            mouseOldPosY = event.pageY;
            if (moveLength < 0 && scrollBtnElemBound.top > scrollTrackElemBound.top) {
                if (Math.abs(moveLength) > scrollTop || scrollTop < 1) {
                    realMoveLength = 0;
                } else {
                    realMoveLength = scrollTop + moveLength;
                }
            } else if (moveLength > 0
                && scrollBtnElemBound.bottom < scrollTrackElemBound.bottom) {
                if (moveLength > scrollBottom || scrollBottom < 1) {
                    realMoveLength = maxScrollHeight;
                } else {
                    realMoveLength = scrollTop + moveLength;
                }
            }
            scrollBtnElem.css({
                top: realMoveLength + 'px'
            });
            scrollTrackElemBound = scrollTrackElem[0].getBoundingClientRect();
            scrollBtnElemBound = scrollBtnElem[0].getBoundingClientRect();
            scrollTop = scrollBtnElemBound.top - scrollTrackElemBound.top;
            innerElem.css({
                top: - (scrollTop / scrollVOverPercent) + 'px'
            });
        };
        let mouseupBtn = (event) => {
            document.body.classList.remove('cm-user-none-select');
            $(document.body).unbind('mousemove', mousemoveBtn);
        };
        scope.mousedownBtn = (event) => {
            mouseOldPosY = event.pageY;
            document.body.classList.add('cm-user-none-select');
            $(document.body).unbind('mouseup', mouseupBtn);
            $(document.body).bind('mousemove', mousemoveBtn);
            $(document.body).bind('mouseup', mouseupBtn);
        };

        $(element).on('mousewheel', (event) => {
            if (event.originalEvent) {
                event = event.originalEvent;
            }
            event.preventDefault();
            scrollTrackElemBound = scrollTrackElem[0].getBoundingClientRect();
            scrollBtnElemBound = scrollBtnElem[0].getBoundingClientRect();
            scrollTop = scrollBtnElemBound.top - scrollTrackElemBound.top;
            scrollBottom = scrollTrackElemBound.bottom - scrollBtnElemBound.bottom;
            if (event.wheelDelta < 0) {
                if (Math.abs(event.wheelDelta * scrollVOverPercent) > scrollBottom || scrollBottom < 1) {
                    realMoveLength = maxScrollHeight;
                } else {
                    realMoveLength = scrollTop + Math.abs(event.wheelDelta * scrollVOverPercent);
                }
            } else if (event.wheelDelta > 0) {
                if (Math.abs(event.wheelDelta * scrollVOverPercent) > scrollTop || scrollTop < 1) {
                    realMoveLength = 0;
                } else {
                    realMoveLength = scrollTop - Math.abs(event.wheelDelta * scrollVOverPercent);
                }
            }
            scrollBtnElem.css({
                top: realMoveLength + 'px'
            });
            scrollTrackElemBound = scrollTrackElem[0].getBoundingClientRect();
            scrollBtnElemBound = scrollBtnElem[0].getBoundingClientRect();
            scrollTop = scrollBtnElemBound.top - scrollTrackElemBound.top;
            innerElem.css({
                top: - (scrollTop / scrollVOverPercent) + 'px'
            });
        });
        
        setInterval(() => {
            let outerHeight = element[0].offsetHeight;
            let innerElem = $('.inner-ct', element);
            let innerHeight = innerElem[0].offsetHeight;
            console.log('inner-->' + outerHeight);
            scope.$apply(() => {
                if (innerHeight > outerHeight) {
                    scope.scrollInfo.show = true;
                } else {
                    scope.scrollInfo.show = false;
                }
            });
        }, 500);
    }

    static getInstance() {
        SetScrollDirective.instance = new SetScrollDirective();
        return SetScrollDirective.instance;
    }
}

SetScrollDirective.getInstance.$inject = [];

module.exports = SetScrollDirective;



