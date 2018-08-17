/**
 * @file slip directive
 * @author zhangzengwei@baidu.com
 */
import './slip.less';

class SlipDirective {
    constructor($timeout) {
        this.restrict = 'EA';
        this.replace = true;
        this.$timeout = $timeout;
        this.scope = {
            config: '='
        };
        this.template = require('./slip.html');
    }

    link(scope, element, attrs) {
        let self = this;
        scope.config = angular.extend({
            type: 'text',
            row: 1,
            showColumn: 1,
            startIndex: 1,
            list: [
                {
                    id: 1,
                    text: {
                        type: 'title-only',
                        title: '介绍1'
                    }
                }
            ]
        }, scope.config);
        self.elemWidth = $(element)[0].getBoundingClientRect().width;
        self.allShowRate = Math.round(scope.config.list.length / scope.config.showColumn);
        self.ctAreaWidth = self.allShowRate * self.elemWidth;
        self.ctArea = $('.j-content-area', element);
        self.ctArea.css({
            width: self.ctAreaWidth + 'px',
            left: 0,
            transition: 'all 1s',
            '-webkit-transition': 'all 1s'
        });
        self.slipItemAreaWidth = self.elemWidth / scope.config.showColumn;
        self.$timeout(() => {
            self.slipStyleSet(scope, element);
        }, 100);
        scope.slipLeftRight = type => {
            if (type === 'right'
                && (scope.config.startIndex + scope.config.showColumn - 1) < scope.config.list.length) {
                scope.config.startIndex++;
            } else if (type === 'left' && scope.config.startIndex > 1) {
                scope.config.startIndex--;
            } else if (type === 'right'
                && (scope.config.startIndex + scope.config.showColumn - 1) === scope.config.list.length) {
                return false;
            } else if (type === 'left' && scope.config.startIndex === 1) {
                return false;
            }
            self.ctArea.css({
                left: - self.slipItemAreaWidth * (scope.config.startIndex - 1) + 'px'
            });
        };
        scope.slipItemClick = item => {
            scope.config.click && scope.config.click(item);
        };
        scope.slipItemHover = item => {
            item.isHover = true;
        };
        scope.slipItemOut = item => {
            item.isHover = false;
        };
    }
    slipStyleSet(scope, dom) {
        let self = this;
        let slipItemArea = $('.j-slip-item', self.ctArea);
        slipItemArea.css({
            width: self.slipItemAreaWidth + 'px'
        });
        scope.config.list.forEach((item, index) => {
            $(slipItemArea[index]).css({
                background: 'url("' + item.img + '") no-repeat center'
            });
        });
    }
    static getInstance($timeout) {
        SlipDirective.instance = new SlipDirective($timeout);
        return SlipDirective.instance;
    }
}
SlipDirective.getInstance.$inject = ['$timeout'];
module.exports = SlipDirective;