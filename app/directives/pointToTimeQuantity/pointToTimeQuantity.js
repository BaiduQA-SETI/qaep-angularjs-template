/**
 * @file select directive
 * @author zhangzengwei@baidu.com
 */
import './pointToTimeQuantity.less';

class PointToTimeQuantityDirective {
    constructor($timeout) {
        this.restrict = 'EA';
        this.replace = true;
        this.scope = {
            pointData: '=',
            pointDetailData: '=',
            startTimeObj: '=',
            endTimeObj: '=',
            pointClick: '='
        };
        this.template = require('./pointToTimeQuantity.html');
        this.$timeout = $timeout;
    }

    link(scope, element, attrs) {
        scope.initInfo = {
            xBarWidth: element[0].getBoundingClientRect().width
        //     startTime: scope.startTimeObj.value,
        //     endTime: scope.endTimeObj.value
        };
        // scope.$watch('pointData', (newV, oldV) => {
        //     console.log('haha', newV, oldV);
        // });
        // console.log(element[0].getBoundingClientRect());
        // scope.initInfo.periodTime = scope.initInfo.endTime - scope.initInfo.startTime;
        // scope.initInfo.periodTime === 0 ? scope.initInfo.periodTime = 1 : '';
        // scope.initInfo.xBarWidth = element[0].getBoundingClientRect().width;
        // scope.initInfo.perUnitScale = scope.initInfo.xBarWidth / scope.initInfo.periodTime;
        scope.getStyle = (point, startTime, endTime) => {
            let curPeriodTime = (endTime.value - startTime.value) === 0
                ? 1
                : endTime.value - startTime.value;
            let curUnitScale = scope.initInfo.xBarWidth / curPeriodTime;
            let curPointPeriod = point.time - startTime.value;
            let curPointXBarPos = curPointPeriod * curUnitScale;
            console.log(curPointXBarPos);
            return {
                marginLeft: curPointXBarPos + 'px'
            };
        };
        scope.setPointDetailStatus = (index, pointData) => {
            pointData.forEach((item, itemIndex) => {
                if (itemIndex === index) {
                    if (item.detailStatus === 'open') {
                        item.detailStatus = 'close';
                        scope.pointClick('close');
                    } else {
                        item.detailStatus = 'open';
                        scope.curPointDetail = item.name;
                        scope.pointClick('open', pointData[index]);
                    }
                } else {
                    if (item.detailStatus === 'open') {
                        item.detailStatus = 'close';
                    }
                }
            });
        };
        scope.setImg = (img) => {
            img.status === 'big'
                ? img.status = 'small'
                : img.status = 'big';
        };
    }
    static getInstance($timeout) {
        PointToTimeQuantityDirective.instance = new PointToTimeQuantityDirective($timeout);
        return PointToTimeQuantityDirective.instance;
    }
}
PointToTimeQuantityDirective.getInstance.$inject = ['$timeout'];

module.exports = PointToTimeQuantityDirective;
