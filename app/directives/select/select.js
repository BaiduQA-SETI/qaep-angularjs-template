/**
 * @file select directive
 * @author zhangzengwei@baidu.com
 */
import './select.less';

class SelectDirective {
    constructor($timeout) {
        this.restrict = 'EA';
        this.replace = true;
        this.scope = {
            myModel: '=',
            myData: '=',
            myIndex: '@'
            // myChange: '='
            // pageInfo: '=info',
            // onChange: '='
        };
        this.template = require('./select.html');
        this.$timeout = $timeout;
    }

    link(scope, element, attrs) {
        let self = this;
        scope.selectInfo = {
            show: false,
            pos: null,
            filter: scope.myData.filter || false,
            filterValue: '',
            listMap: scope.myData.listMap || {
                key: 'name',
                value: 'id'
            },
            text: '',
            listPosContrastDom: scope.myData.listPosContrastDom || 'document'
        };
        scope.getShowText = (list) => {
            let curText = (list || []).filter((item) => {
                return item[scope.selectInfo.listMap.value] === scope.myModel;
            })[0];
            return curText ? curText[scope.selectInfo.listMap.key] : '';
        };
        scope.getBoxClass = (isFilter, pos) => {
            let styleStr = '';
            styleStr += pos === 'down' ? 'down-list ' : (pos === 'up' ? 'up-list ' : '');
            styleStr += isFilter === true ? 'show-filter' : 'hide-filter';
            return styleStr;
        };
        scope.isShowTitle = (showTitle, item) => {
            if (showTitle !== false) {
                return item[scope.selectInfo.listMap.key];
            } else {
                return '';
            }
        };

        let globalClickCallBack = (event) => {
            let elementBound = element[0].getBoundingClientRect();
            let outTBound = event.clientY < elementBound.top;
            let outBBound = event.clientY > elementBound.bottom;
            let outLBound = event.clientX < elementBound.left;
            let outRBound = event.clientX > elementBound.right;
            let outBound = outTBound || outBBound || outLBound || outRBound;
            if (outBound) {
                $(document).unbind('click', globalClickCallBack);
                scope.$apply(() => {
                    scope.selectInfo.show = false;
                    scope.selectInfo.pos = null;
                });
            }
        };
        scope.openSelectList = (event) => {
            if (!scope.selectInfo.show) {
                if (scope.selectInfo.listPosContrastDom === 'document') {
                    if (element[0].getBoundingClientRect().bottom + 200 + 60
                        < document.body.scrollHeight) {
                        scope.selectInfo.pos = 'down';
                    } else {
                        scope.selectInfo.pos = 'up';
                    }
                } else {
                    // console.log($(scope.selectInfo.listPosContrastDom)[0]);
                    let contrastDomBorderWidth = parseFloat(window
                        .getComputedStyle($(scope.selectInfo.listPosContrastDom)[0], null)
                        .borderWidth
                        .split('px')[0]);
                    let contrastDomScrollTop = $(scope.selectInfo.listPosContrastDom).scrollTop();
                    let contrastDomScrollHeight = $(scope.selectInfo.listPosContrastDom)[0]
                        .scrollHeight + contrastDomBorderWidth * 2;
                    let contrastDomBounding = $(scope.selectInfo.listPosContrastDom)[0]
                        .getBoundingClientRect();
                    let contrastDomRollDistance = Math.abs(contrastDomScrollHeight
                        - contrastDomBounding.height) > 1
                        ? Math.abs(contrastDomScrollHeight - contrastDomBounding.height)
                        : 0;
                    let contrastDomRealBottom = contrastDomBounding.bottom + contrastDomRollDistance;
                    // console.log(contrastDomBorderWidth);
                    // console.log(contrastDomScrollTop);
                    // console.log(contrastDomScrollHeight);
                    // console.log(contrastDomBounding);
                    // console.log(contrastDomRollDistance);
                    // console.log(contrastDomRealBottom);
                    // console.log(element[0].getBoundingClientRect().bottom);
                    if (element[0].getBoundingClientRect().bottom
                        + contrastDomScrollTop + 200 + 60
                        < contrastDomRealBottom) {
                        scope.selectInfo.pos = 'down';
                    } else {
                        scope.selectInfo.pos = 'up';
                    }
                }
                scope.selectInfo.show = true;
                if (scope.selectInfo.pos === 'up') {
                    let selectListDom = element.find('.select-list')[0];
                    selectListDom.setAttribute('style', 'margin-top:-' + 100 + 'px');
                    self.$timeout(() => {
                        let selectListH = selectListDom.getBoundingClientRect().height;
                        selectListDom.setAttribute('style', 'margin-top:-' + selectListH + 'px');
                    }, 100);
                }
            }
            $(document).bind('click', globalClickCallBack);
        };
        scope.selectOneItem = (event, option) => {
            if (scope.myModel === option[scope.selectInfo.listMap.value]) {
                return false;
            }
            scope.myModel = option[scope.selectInfo.listMap.value];
            scope.selectInfo.text = option[scope.selectInfo.listMap.key];
            scope.selectInfo.show = false;
            scope.selectInfo.pos = null;
            if (scope.myData.change !== undefined && scope.myData.change !== '') {
                if (scope.myIndex !== undefined) {
                    option.slBoxIndex = scope.myIndex;
                }
                scope.myData.change(option);
            }
            event.stopPropagation();
        };
        scope.selectFilter = (event) => {
            event.stopPropagation();
        };
        scope.setListPos = (isShow, isFilter, filterValue) => {
            if (isShow && scope.selectInfo.pos === 'up') {
                let listHeight = $('.select-list', element)[0]
                    .getBoundingClientRect().height;
                let moveValue = isFilter === true
                    ? listHeight + 30 + 'px'
                    : listHeight + 'px';
                $('.select-list', element).css({
                    top: - moveValue
                });
            }
        };
    }
    static getInstance($timeout) {
        SelectDirective.instance = new SelectDirective($timeout);
        return SelectDirective.instance;
    }
}
SelectDirective.getInstance.$inject = ['$timeout'];

module.exports = SelectDirective;
