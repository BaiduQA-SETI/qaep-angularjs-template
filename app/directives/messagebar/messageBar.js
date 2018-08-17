define(['app'], function (app) {
	app.directive('messagebar', function () {
		var classNames = {
				'success': 'alert-success',
				'error': 'alert-danger',
				'info': 'alert-info',
				'warning': 'alert-warning'
			}, 
			link = function (scope, element, attrs) {
				angular.extend(scope, {
					close: function (e) {
						scope.msgInfo.show = false;
					}
				});

				if (scope.msgInfo) {
					angular.element(element).addClass(classNames[scope.msgInfo.type || 'info']);
				}

				scope.$watch('msgInfo.type', function(type, oldValue) {
				    angular.element(element).addClass(classNames[type || 'info']);
				});
			};
		
		/**
		 * msgInfo data structure
		 * {
		 *     show: {Boolean} 
		 *     type: {String} success,error,warning,info
		 *     msg: {String} 
		 * }
		 */

		return {
		    restrict: 'E',
	        replace: true, // Replace with the template below
    		transclude: true, // we want to insert custom content inside the directive
	        scope: {
	            msgInfo: '=info',
	            onClose: '&'
	        },
	        templateUrl: 'js/directives/messagebar/messageBar.html',
	        link: link
		};
	});
});