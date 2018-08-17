import './spliter.css';

export default class SpliterDirective {
    constructor() {
        this.restrict = 'AE';
        this.replace = true;
        this.scope = {};
    }

    link(scope, element, attrs) {
        var splitterLine = $(element).find('.spliter-line');
        var isMousedown = false;
        var startPos = 0;
        var delt = 0;
        var leftArea = splitterLine.prev().addClass('spliter-left');
        var rightArea = splitterLine.next().addClass('spliter-right');
        var leftWidth = leftArea.width();
        var initialMinWidth = +parseInt(leftArea.css('minWidth')) || 0;
        console.log(leftWidth);
        $(element).addClass('spliter-dt');
        splitterLine.append('<div class="line-arrow"></div>');

        var mouseMoveHandle = function (e) {
            e.preventDefault();
            if (isMousedown) {
                delt = startPos - e.pageX;
                leftWidth = Math.max(leftArea.width() - delt, 0);
                leftArea.width(leftWidth);
                startPos = e.pageX;
                console.log(leftWidth);
            }
        };
        var mouseupHandle = function (e) {
            isMousedown = false;
            $(document).off('mousemove', mouseMoveHandle);
            $(document).off('mouseup', mouseupHandle);
        };

        splitterLine.on('mousedown', function (e) {
            isMousedown = true;
            startPos = e.pageX;
            leftArea.removeClass('transition-all');
            $(document).on('mousemove', mouseMoveHandle);
            $(document).on('mouseup', mouseupHandle);
        });

        splitterLine.on('click', '.line-arrow', function (e) {
            var target = $(e.currentTarget);
            var width = leftWidth;
            var minWidth = initialMinWidth;
            target.toggleClass('right');
            leftArea.addClass('transition-all');

            if (target.hasClass('right')) {
                width = 10;
                minWidth = width;
            }
            leftArea.css({
                width: width,
                minWidth: minWidth
            });
            e.stopPropagation();
        });
    }
}

