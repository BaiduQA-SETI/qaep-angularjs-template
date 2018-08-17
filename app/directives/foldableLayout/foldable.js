/**
 * @file foldable width height directive
 * @author zhangzengwei@baidu.com
 */
import './foldable.less';

class FoldableDirective {
    constructor($compile) {
        this.$compile = $compile;
        this.restrict = 'EA';
        this.transclude = true;
        this.scope = {
        };
        this.template = require('./foldable.html');
    }

    link(scope, element, attrs) {
        scope.foldableInfo = {
            status: 'open',
            type: (attrs.foldableType === undefined
                ||　attrs.foldableType === '')
                ? 'left' : attrs.foldableType
        };
        scope.foldableOpenClose = () => {
            scope.foldableInfo.status === 'open'
                ? scope.foldableInfo.status = 'close'
                : scope.foldableInfo.status = 'open';
        };
        scope.getStyleClass = (info) => {
            let styleClass = '';
            switch (info.type) {
                case 'left' : {
                    styleClass += 'fold-left ';
                    break;
                }
                case 'right' : {
                    styleClass += 'fold-right ';
                    break;
                }
                case 'up' : {
                    styleClass += 'fold-up ';
                    break;
                }
                case 'down' : {
                    styleClass += 'fold-down ';
                    break;
                }
            }
            info.status === 'open'
                ? styleClass += 'status-open'
                : styleClass += 'status-close';
            return styleClass;
        };
        this.addFoldableTag(scope, element, attrs);
    }
    addFoldableTag(scope, element, attrs) {
        let foldableTagAreaDom = document.createElement('span');
        foldableTagAreaDom.setAttribute('ng-click', 'foldableOpenClose()');
        foldableTagAreaDom.classList.add('foldable-tag-area');
        let foldableTagDom = document.createElement('i');
        foldableTagDom.classList.add('fa');
        foldableTagDom.classList.add('fa-lg');
        foldableTagDom.classList.add('fa-angle-left');
        // foldableTagDom.setAttribute('type', 'leftcircleo');
        switch (scope.foldableInfo.type) {
            case 'left' : {
                let leftDomView = $('.j-foldable-ct', element)[0].childNodes[1];
                leftDomView.appendChild(foldableTagAreaDom);
                break;
            }
            case 'right' : {
                let rightDomView = $('.j-foldable-ct', element)[0].childNodes[3];
                rightDomView.appendChild(foldableTagAreaDom);
                break;
            }
            case 'up' : {
                let upDomView = $('.j-foldable-ct', element)[0].childNodes[1];
                upDomView.appendChild(foldableTagAreaDom);
                break;
            }
            case 'down' : {
                let downDomView = $('.j-foldable-ct', element)[0].childNodes[3];
                downDomView.appendChild(foldableTagAreaDom);
                break;
            }
        }
        foldableTagAreaDom.appendChild(foldableTagDom);
        this.$compile(foldableTagAreaDom)(scope);
    }
    static getInstance($compile) {
        FoldableDirective.instance = new FoldableDirective($compile);
        return FoldableDirective.instance;
    }
}
FoldableDirective.getInstance.$inject = ['$compile'];
module.exports = FoldableDirective;
