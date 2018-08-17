/**
 * @file carousel directive
 * @author zhangzengwei@baidu.com
 */
import './carousel.less';

class CarouselDirective {
    constructor($interval) {
        this.restrict = 'EA';
        this.replace = true;
        this.scope = {
            myCarouselData: '='
        };
        this.template = require('./carousel.html');
        this.$interval = $interval;
    }

    link(scope, element, attrs) {
        let self = this;
        scope.initConf = {
            type: 'auto',
            direction: 'init',
            oldActiveId: 'init',
            activeId: 1,
            prevId: scope.myCarouselData.list.length,
            nextId: 2
        };
        self.elementHeightSet(scope, element);
        scope.$on('onresize', (d, data) => {
            self.elementHeightSet(scope, element);
        });
        scope.getCarouselItemClass = index => {
            let newIndex = index + 1;
            if (newIndex === scope.initConf.activeId) {
                if (scope.initConf.direction === 'init') {
                    return 'default';
                } else {
                    return 'active';
                }
            } else if (newIndex === scope.initConf.oldActiveId) {
                return 'old-active';
            }
        };
        scope.switchCarousel = (type, direction) => {
            scope.initConf.type = type;
            scope.initConf.oldActiveId = scope.initConf.activeId;
            if (type === 'lr') {
                if (direction === 'left') {
                    scope.initConf.activeId--;
                    self.leftConf(scope);
                } else if (direction === 'right') {
                    scope.initConf.activeId++;
                    self.rightConf(scope);
                }
            } else if (type === 'index') {
                scope.initConf.activeId = direction + 1;
                if ((direction + 1) < scope.initConf.activeId) {
                    self.leftConf(scope);
                } else if ((direction + 1) > scope.initConf.activeId) {
                    self.rightConf(scope);
                }
            }
        };
        scope.goBtnClick = item => {
            item.click && item.click(item);
        };
        self.autoSwitchCarousel(scope);
    }
    elementHeightSet(scope, element) {
        let self = this;
        let browserH;
        let browserW;
        if (window.innerHeight) {
            browserH = window.innerHeight;
        } else if ((document.body) && (document.body.clientHeight)) {
            browserH = document.body.clientHeight;
        }
        $(element).css({
            height: browserH + 60 + 'px'
        });
        let tempImg = new Image();
        tempImg.onload = () => {
            let oldWidth = tempImg.width;
            let oldHeight = tempImg.height;
            let wHRate = oldWidth / oldHeight;
            let newWidth = $(element)[0].getBoundingClientRect().width;
            let newHeight = oldHeight * newWidth / oldWidth;
            tempImg.width = newWidth;
            tempImg.height = newHeight;
            $('.j-carousel-lr-tags', element).css({
                'line-height': newHeight + 'px'
            });
        };
        tempImg.src = scope.myCarouselData.list[0].src;
    }
    leftConf(scope) {
        let self = this;
        scope.initConf.direction = 'left';
        if (scope.initConf.activeId === 0) {
            scope.initConf.activeId = scope.myCarouselData.list.length;
        }
    }
    rightConf(scope) {
        let self = this;
        scope.initConf.direction = 'right';
        if (scope.initConf.activeId === scope.myCarouselData.list.length + 1) {
            scope.initConf.activeId = 1;
        }
    }
    autoSwitchCarousel(scope) {
        let self = this;
        self.autoSwitchInterval = self.$interval(() => {
            scope.initConf.type = 'auto';
            scope.initConf.oldActiveId = scope.initConf.activeId;
            scope.initConf.activeId++;
            self.rightConf(scope);
        }, 10000);
    }
    static getInstance($interval) {
        CarouselDirective.instance = new CarouselDirective($interval);
        return CarouselDirective.instance;
    }
}
CarouselDirective.getInstance.$inject = ['$interval'];
module.exports = CarouselDirective;