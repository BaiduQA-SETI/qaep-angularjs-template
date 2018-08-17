/**
 * @file resizableLayout directive
 * @author zhangyou04@baidu.com
 */
import angular from 'angular';
import $ from 'jquery';
import './layout.less';

class ResizableLayoutDirective {
    constructor() {

    }

    link(scope, element, attrs, ctrl) {
        angular.element(element).addClass('ui-layout');
        let direction = attrs.direction || 'vertical';
        angular.element(element).addClass('layout-' + direction);
        if (attrs.height) {
            // angular.element(element).height(attrs.height);
            $(element).height(attrs.height);
        }
    }

    controller($scope, $element, $attrs) {
        this.getResizable = () => {
            return $attrs.resizable === 'true';
        };
    }

    static getInstance() {
        ResizableLayoutDirective.instance = new ResizableLayoutDirective();
        return ResizableLayoutDirective.instance;
    }
}

ResizableLayoutDirective.getInstance.$inject = ['$scope', '$element', '$attrs'];

class LayoutTopDirective {
    constructor($compile) {
        this.$compile = $compile;
        this.require = '^layout';
        this.scope = {};
    }

    link(scope, element, attrs, layoutCtrl) {
        angular.element(element).addClass('ui-layout-top');
        if (attrs.height) {
            // angular.element(element).height(attrs.height);
            $(element).height(attrs.height);
        }

        let resizable = angular.isUndefined(attrs.resizable) ? layoutCtrl.getResizable() : attrs.resizable;
        if (resizable) {
            $(this.$compile('<layout-spliter direction="h" target="top"/>')(scope)).insertAfter($(element));
        }
    }

    static getInstance($compile) {
        LayoutTopDirective.instance = new LayoutTopDirective($compile);
        return LayoutTopDirective.instance;
    }
}

LayoutTopDirective.getInstance.$inject = ['$compile'];

class LayoutCenterDirective {
    constructor() {

    }

    link(scope, element, attrs) {
        angular.element(element).addClass('ui-layout-center');
        let direction = attrs.direction || 'vertical';
        angular.element(element).addClass(direction);
        if (attrs.height) {
            // angular.element(element).height(attrs.height);
            $(element).height(attrs.height);
        }
    }
}

class LayoutLeftDirective {
    constructor($compile) {
        this.$compile = $compile;
        this.require = '^layout';
    }

    link(scope, element, attrs, layoutCtrl) {
        angular.element(element).addClass('ui-layout-left');
        if (attrs.width) {
            // angular.element(element).width(attrs.width);
            $(element).width(attrs.width);
        }

        let resizable = angular.isUndefined(attrs.resizable) ? layoutCtrl.getResizable() : attrs.resizable;
        if (resizable) {
            $(this.$compile('<layout-spliter direction="v" target="left"/>')(scope)).insertAfter($(element));    
        }
    }

    static getInstance($compile) {
        LayoutLeftDirective.instance = new LayoutLeftDirective($compile);
        return LayoutLeftDirective.instance;
    }
}

LayoutLeftDirective.getInstance.$inject = ['$compile'];

class LayoutRightDirective {
    constructor() {
        this.require = '^layout';
    }

    link(scope, element, attrs, layoutCtrl) {
        angular.element(element).addClass('ui-layout-right');
        if (attrs.width) {
            // angular.element(element).width(attrs.width);
            $(element).width(attrs.width);
        }
    }
}

class LayoutBottomDirective {
    constructor($compile) {
        this.$compile = $compile;
        this.require = '^layout';
        this.scope = {};
    }

    link(scope, element, attrs, layoutCtrl) {
        angular.element(element).addClass('ui-layout-bottom');
        if (attrs.height) {
            // angular.element(element).height(attrs.height);
            $(element).height(attrs.height);
        }

        let resizable = angular.isUndefined(attrs.resizable) ? layoutCtrl.getResizable() : attrs.resizable;
        if (resizable) {
            $(this.$compile('<layout-spliter direction="h" target="bottom"/>')(scope)).insertBefore($(element));
        }
    }

    static getInstance($compile) {
        LayoutBottomDirective.instance = new LayoutBottomDirective($compile);
        return LayoutBottomDirective.instance;
    }
}

LayoutBottomDirective.getInstance.$inject = ['$compile'];

class LayoutSpliterDirective {
    constructor() {
        this.replace = true;
        this.scope = {};
        this.template = '<div class="{{direction}}spliter" ng-mousedown="mousedownHandle($event)"></div>';
    }

    link(scope, element, attrs) {
        let targetLayout;
        let rect = {
            height: 0,
            width: 0
        };
        let startPos = {
            x: 0,
            y: 0
        };
        let direction = attrs.direction;
        let isHorizontal = direction === 'h';
        let target = attrs.target || (isHorizontal ? 'top' : 'left');
        let isMousedown = false;
        let mousemoveHandle = function (evt) {
            evt.preventDefault();
            if (isMousedown) {
                if (isHorizontal) {
                    rect.height += (evt.pageY - startPos.y) * (target === 'top' ? 1 : -1);
                    startPos.y = evt.pageY;
                    targetLayout.height(rect.height);
                }
                else {
                    rect.width += (evt.pageX - startPos.x) * (target === 'left' ? 1 : -1);
                    startPos.x = evt.pageX;
                    targetLayout.width(rect.width);
                }
            }
        };
        let mouseupHandle = function (evt) {
            isMousedown = false;
            $(document).off('mousemove', mousemoveHandle);
            $(document).off('mouseup', mouseupHandle);
        };

        scope.direction = attrs.direction;
        scope.mousedownHandle = function (evt) {
            isMousedown = true;
            startPos = {
                x: evt.pageX,
                y: evt.pageY
            };
            targetLayout = $(element)[target === 'top' || target === 'left' ? 'prev' : 'next']();
            if (isHorizontal) {
                rect.height = targetLayout.height();
            }
            else {
                rect.width = targetLayout.width();
            }
            $(document).on('mousemove', mousemoveHandle);
            $(document).on('mouseup', mouseupHandle);
        };
    }
}

exports.ResizableLayoutDirective = ResizableLayoutDirective;
exports.LayoutTopDirective = LayoutTopDirective;
exports.LayoutCenterDirective = LayoutCenterDirective;
exports.LayoutBottomDirective = LayoutBottomDirective;
exports.LayoutLeftDirective = LayoutLeftDirective;
exports.LayoutRightDirective = LayoutRightDirective;
exports.LayoutSpliterDirective = LayoutSpliterDirective;



