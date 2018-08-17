/**
 * @file dialog directive
 * @author zhangyou04@baidu.com
 */
class SetFocusDirective {
    constructor() {
    	this.scope = {
    		setFocus: '='
    	};
    }

    link(scope, element, attrs) {
    	scope.$watch('setFocus', () => {
            // console.log(scope.setFocus);
    		if (scope.setFocus) {
	    		setTimeout(() => {
		    		element[0].focus();
		    	}, 200);
	    	}
    	});
    	element.on('blur', () => {
    		scope.$apply(scope.setFocus = false);
    	});
    }

    static getInstance() {
        SetFocusDirective.instance = new SetFocusDirective();
        return SetFocusDirective.instance;
    }
}

SetFocusDirective.getInstance.$inject = [];

module.exports = SetFocusDirective;



