/**
 * @file dialog directive
 * @author zhangyou04@baidu.com
 */
class DialogDirective {
    constructor($parse) {
        this.$parse = $parse;
        this.restrict = 'E';
        this.replace = true;
        this.transclude = true;
        this.scope = {
            dlgInfo: '=info',
            onCancel: '=',
            onClose: '=',
            onOk: '=',
            onNext: '='
        };
        this.template = require('./dialog.html');
    }

    link(scope, element, attrs) {
        let toggle = function (element, scope, isShow) {
            $(element).modal(isShow ? 'show' : 'hide');
        };
        angular.extend(
            scope,
            {
                cancel(e) {
                    toggle(element, scope, false);
                },
                close(e) {
                    toggle(element, scope, false);
                },
                ok(e) {
                    if (!scope.dlgInfo.preventClose) {
                        toggle(element, scope, false);
                    }

                    scope.onOk && scope.onOk(scope);
                },
                next(e) {
                    if (!scope.dlgInfo.preventClose) {
                        toggle(element, scope, false);
                    }

                    scope.onNext && scope.onNext(scope);
                }
            }
        );

        scope.$watch('dlgInfo.show', (isShow, oldValue) => {
            toggle(element, scope, isShow);
        });

        $(element).on('hidden.bs.modal', function () {
            scope.$apply(scope.dlgInfo.show = false);
        });
    }

    static getInstance($parse) {
        DialogDirective.instance = new DialogDirective($parse);
        return DialogDirective.instance;
    }
}

DialogDirective.getInstance.$inject = ['$parse'];

module.exports = DialogDirective;



