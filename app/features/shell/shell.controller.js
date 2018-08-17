/**
 * @file shell controller
 * @author zhangyou04@baidu.com
 */

import './shell.less';
class ShellController {
    constructor($rootScope, $scope, $state) {
        this.$state = $state;
        this.$scope = $scope;
        this.$rootScope = $rootScope;

        this.headerItems = [
            {
                id: 'index',
                name: '首页'
            },
            {
                id: 'newtab',
                name: '新Tab'
            }
        ];
        this.screenSize = 'small';
        this.headerBgClass = ($state.current.url === 'index') ? 'none' : 'other';
        let browserH;
        let browserW;
        if (window.innerHeight) {
            browserH = window.innerHeight;
            browserW = window.innerWidth;
        } else if ((document.body) && (document.body.clientHeight)) {
            browserH = document.body.clientHeight;
            browserW = document.body.clientWidth;
        }
        this.browserH = browserH;
        this.screenSize = browserW > 1500 ? 'big' : 'small';
        $rootScope.$emit('onresize', this.screenSize);
        $(window).bind('scroll', () => {
            $scope.$apply(() => {
                if ($state.current.url === 'index') {
                    let scrollValue = $(window).scrollTop();
                    // console.log(scrollValue, this.browserH - 300);
                    if (scrollValue < 100) {
                        this.headerBgClass = 'none';
                    } else if (scrollValue > 100 && scrollValue <= 200) {
                        this.headerBgClass = 'one';
                    } else if (scrollValue > 200 && scrollValue <= (this.browserH - 300)) {
                        this.headerBgClass = 'three';
                    } else if (scrollValue > (this.browserH - 300)) {
                        this.headerBgClass = 'five';
                    }
                    $rootScope.$broadcast('scrollValue', scrollValue);
                } else if ($state.current.url === 'ecology') {
                    let scrollValue = $(window).scrollTop();
                    // console.log(scrollValue, this.browserH - 300);
                    if (scrollValue < 100) {
                        this.headerBgClass = 'none';
                    } else if (scrollValue > 100 && scrollValue <= 200) {
                        this.headerBgClass = 'two';
                    } else if (scrollValue > 200 && scrollValue <= (this.browserH - 300)) {
                        this.headerBgClass = 'four';
                    } else if (scrollValue > (this.browserH - 300)) {
                        this.headerBgClass = 'five';
                    }
                    $rootScope.$broadcast('scrollValue', scrollValue);
                } else {
                    this.headerBgClass = 'other';
                }
            });
        });

        window.onresize = function () {
            $rootScope.$broadcast('onresize', '');
            let browserH;
            let browserW;
            if (window.innerHeight) {
                browserH = window.innerHeight;
                browserW = window.innerWidth;
            } else if ((document.body) && (document.body.clientHeight)) {
                browserH = document.body.clientHeight;
                browserW = document.body.clientWidth;
            }
            this.browserH = browserH;
            this.screenSize = browserW > 1500 ? 'big' : 'small';
            $rootScope.$emit('onresize', this.screenSize);
            this.indexCooperationElemRect = $('.index-view .part4')[0] !== undefined
                ? $('.index-view')[0] .getBoundingClientRect()
                : {};
        };
        let self = this;
        self.curMenu = null;
        $scope.$on('$stateChangeSuccess', function (event, toState) {
            self.curMenu = toState.name.split('.')[1];
            if (toState.url === 'index') {
                self.headerBgClass = 'none';
            } else {
                self.headerBgClass = 'other';
            }
            if (toState.name && toState.name.indexOf('shell.admin') !== -1) {
                self.isAdmin = true;
                self.curMenu = toState.name.split('.')[2];
                $('body').css('background', '#f9f9f9');
            } else {
                self.isAdmin = false;
                $('body').css('background', 'transparent');
            }
            // 百度统计代码
            /* eslint-disable max-len */
            window._hmt.push(['_trackPageview', `/index.html?username=${$rootScope.userInfo.username}&hash=${toState.url}`]);
            /* eslint-disable max-len */
        });
    }
}

ShellController.$inject = ['$rootScope', '$scope', '$state'];

module.exports = ShellController;