/**
 * @file dialog directive
 * @author zhangyou04@baidu.com
 */
class CompileDirective {
    constructor($compile) {
        this.$compile = $compile;
    }

    link(scope, element, attrs) {
        scope.$watch(
            scope => scope.$eval(attrs.compile),
            value => {
                element.html(value);
                this.$compile(element.contents())(scope);
            }
        );
    }

    static getInstance($compile) {
        CompileDirective.instance = new CompileDirective($compile);
        return CompileDirective.instance;
    }
}

CompileDirective.getInstance.$inject = ['$compile'];

module.exports = CompileDirective;



