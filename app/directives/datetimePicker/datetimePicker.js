/**
 * @file select directive
 * @author zhangzengwei@baidu.com
 */
import './angularjs-datetime-picker/angularjs-datetime-picker.min.js';
import './angularjs-datetime-picker/angularjs-datetime-picker.min.css';
import './datetimePicker.less';

class DatetimePickerDirective {
    constructor($timeout, $parse, dateFilter) {
        this.$timeout = $timeout;
        this.$parse = $parse;
        this.dateFilter = dateFilter;
        this.restrict = 'EA';
        this.replace = true;
        this.scope = {
            dateTime: '=',
            datePreEnable: '=',
            dateAfterEnable: '=',
            dateTimeChange: '='
        };
        this.template = require('./datetimePicker.html');
    }

    link(scope, element, attrs) {
        let self = this;
        scope.datetimePickerInfo = {
            dateOnly: attrs.dateOnly !== undefined ? '' : false,
            readOnly: attrs.readOnly !== undefined ? true : false,
            dateTimeFormat: (attrs.dateTimeFormat !== undefined && attrs.dateTimeFormat !== '')
                ? attrs.dateTimeFormat : 'yyyy-MM-dd HH:mm:ss',
            isBegThanEnd: false,
            isEndThanBeg: true,
            isRealChange: false
        };
        let lastV = scope.dateTime;
        // scope.dateTime = self.dateFilter(scope.dateTime, scope.datetimePickerInfo.dateTimeFormat);
        scope.$watch('dateTime', (newV, oldV) => {
            if (newV !== oldV) {
                // console.log(scope.datePreEnable);
                if (scope.datePreEnable !== undefined) {
                    if (newV > scope.datePreEnable) {
                        scope.datetimePickerInfo.isBegThanEnd = true;
                        scope.datetimePickerInfo.isRealChange = false;
                        self.$timeout(() => {
                            scope.dateTime = oldV;
                            scope.datetimePickerInfo.isBegThanEnd = false;
                        }, 1500);
                    } else {
                        scope.datetimePickerInfo.isRealChange = true;
                    }
                }
                if (scope.dateAfterEnable !== undefined) {
                    if (newV < scope.dateAfterEnable) {
                        scope.datetimePickerInfo.isEndThanBeg = false;
                        scope.datetimePickerInfo.isRealChange = false;
                        self.$timeout(() => {
                            scope.dateTime = oldV;
                            scope.datetimePickerInfo.isEndThanBeg = true;
                        }, 1500);
                    } else {
                        scope.datetimePickerInfo.isRealChange = true;
                    }
                }
                if (scope.dateTimeChange !== undefined && scope.datetimePickerInfo.isRealChange) {
                    if (newV !== lastV) {
                        attrs.value = newV;
                        scope.dateTimeChange(attrs);
                        lastV = newV;
                    }
                }
            }
        });

        // scope.$watch('date', (ov, nv) => {
        //     let key = attrs.date;
        //     let getter = this.$parse(key);
        //     let setter = getter.assign;
        //     setter(element.scope(), scope.date);
        // });
        scope.triggerDateBox = function (event) {
            self.$timeout(function () {
                $(event.target).parent().find('input').trigger('click');
            }, 100);
        };
    }

    static getInstance($timeout, $parse, dateFilter) {
        DatetimePickerDirective.instance = new DatetimePickerDirective($timeout, $parse, dateFilter);
        return DatetimePickerDirective.instance;
    }
}

DatetimePickerDirective.getInstance.$inject = ['$timeout', '$parse', 'dateFilter'];

module.exports = DatetimePickerDirective;
