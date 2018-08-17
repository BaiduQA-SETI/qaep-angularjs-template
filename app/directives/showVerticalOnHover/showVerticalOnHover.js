/**
 * @file showVerticalOnHover directive
 * @author zhangzengwei@baidu.com
 */
import './showVerticalOnHover.less';

export default class ShowVerticalOnHover {
    constructor() {
        this.restrict = 'EA';
        this.transclude = true;
        // this.replace = true;
        this.scope = {
            myModel: '=',
            myData: '='
            // myChange: '='
            // pageInfo: '=info',
            // onChange: '='
        };
        // this.template = '<span class="show-vertical-on-hover-box" ng-transclude></span>';
        this.template = require('./showVerticalOnHover.html');
    }

    link(scope, element, attrs) {
        console.log(attrs);
        scope.myselfInfo = {
            focus: attrs.focus !== undefined
        };
        scope.mouseover = function (event) {
            let elementWidth = element[0].getBoundingClientRect().width;
            let listElem = $('ul', element);
            let listWidth = listElem[0].getBoundingClientRect().width;
            console.log(elementWidth, listWidth);
            // console.log(event.target.getBoundingClientRect());
            if (listWidth > elementWidth) {
                listElem.css({
                    'margin-left': -(listWidth - elementWidth) / 2 + 'px'
                });
            }
        };
    }
}
