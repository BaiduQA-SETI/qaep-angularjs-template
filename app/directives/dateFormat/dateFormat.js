// DateFormatDirective.$inject = ['$filter'];
import moment from 'moment';

class DateFormatDirective {
	constructor($filter, $window) {
        // console.log($filter, $window);
		this.require = '^ngModel';
		this.dateFilter = $filter('date');
		this.$window = $window;
        this.$filter = $filter;
	}

	controller() {
		// console.log('controller', this.$filter, this.$window);
	}

	link(scope, element, attrs, ctrl) {
		var me = this;

		console.log(scope, element, attrs, ctrl);

		ctrl.$formatters.push(function (value) {
			return me.dateFilter(value, attrs.dateFormat || 'yyyy-MM-dd HH:mm');
		});
		ctrl.$parsers.unshift(function () {
			return ctrl.$modelValue;
		});
		// alert(moment);
		// var moment = me.$window.moment;
        var dateFormat = attrs.dateFormat;
        attrs.$observe('dateFormat', function (newValue) {
            if (dateFormat == newValue || !ctrl.$modelValue) return;
            dateFormat = newValue;
            ctrl.$modelValue = new Date(ctrl.$setViewValue);
        });

        ctrl.$formatters.unshift(function (modelValue) {
            if (!dateFormat || !modelValue) return "";
            var retVal = moment(modelValue).format(dateFormat);
            return retVal;
        });

        ctrl.$parsers.unshift(function (viewValue) {
            var date = moment(viewValue, dateFormat);
            return (date && date.isValid() && date.year() > 1950 ) ? date.toDate() : "";
        });
	}

	static getInstance($filter, $window) {
		DateFormatDirective.instance = new DateFormatDirective($filter, $window);
		return DateFormatDirective.instance;
	}
}

DateFormatDirective.getInstance.$inject = ['$filter', '$window'];

module.exports = DateFormatDirective;

