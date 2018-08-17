/**
 * @file app bootstrap
 * @author zhangzengwei@baidu.com
 */
import 'bootstrap';
import 'bootstrap/less/bootstrap.less';
import 'angular-material/angular-material.css';
// import './style/foundation-icons/foundation-icons.css';
import 'font-awesome/css/font-awesome.css';
import jquery from 'jquery';
import angular from 'angular';
import 'angular-animate';
import 'angular-aria';
import 'angular-messages';
import 'angular-material';
import 'oclazyload';
import 'angular-sanitize';
import 'angular-md5';
import uirouter from 'angular-ui-router';
import config from './app.config';
import shell from './features/shell';
import index from './features/index';
import newtab from './features/newtab'; // 跟添加的新tab想对应名称
import './dep/dateTimePicker/jquery.datetimepicker.min.css';
import './dep/dateTimePicker/jquery.datetimepicker.min.js';
import basemodel from './services/BaseModel';
import servicesConfig from './servicesConfig';
window.$ = jquery;
let app = angular.module('app', [
    uirouter, 'oc.lazyLoad', 'ngMaterial', 'ngSanitize', 'angular-md5',
    basemodel, shell, index, newtab
]);
app.config(config)
    .value('SERVICESCONFIG', servicesConfig)
    .run(
        [
            '$http',
            '$rootScope',
            '$timeout',
            function ($http, $rootScope, $timeout) {
                /**
                 * 全局popup提示显示影藏逻辑
                 * @type {Boolean}
                 */
                angular.extend($rootScope, {
                    showLoading: false,
                    forceShowLoading: false,
                    showGlobalPopup: false,
                    noAuth: false,
                    noAction: false,
                    noCloseBtn: true,
                    title: '友情提示',
                    popupMsg: 'Hey man something wrong....',
                    contentStyle: {
                        minHeight: window.innerHeight - 60
                    },
                    onConfirm() {
                        app.closePopup();
                        if ($rootScope.confirmHandle) {
                            $rootScope.confirmHandle();
                            delete $rootScope.confirmHandle;
                        }
                        // else {
                        //     app.closePopup();
                        // }
                    }
                });

                $rootScope.$watch('showGlobalPopup', function (newValue, oldValue) {
                    $('#error-message').modal(newValue ? 'show' : 'hide').parent().show();
                });

                $rootScope.$on('$stateChangeStart', function (evt, toState) {
                    $rootScope.isIndexView = toState.url === 'index';
                });
                $rootScope.$on('$stateChangeSuccess', function (evt, toState) {
                    $rootScope.curRouterName = toState.name;
                });

                if (document.body.scrollTop > 10) {
                    $rootScope.bodyScrollTop = true;
                } else {
                    $rootScope.bodyScrollTop = false;
                }
                $(window).scroll(() => {
                    $rootScope.$apply(() => {
                        if (document.body.scrollTop > 10) {
                            $rootScope.bodyScrollTop = true;
                        } else {
                            $rootScope.bodyScrollTop = false;
                        }
                    });
                });

                $rootScope.closePopup = function () {
                    $rootScope.showGlobalPopup = false;
                };
                $rootScope.getStyleClass = function () {
                    if ($rootScope.curRouterName !== undefined) {
                        if ($rootScope.curRouterName === 'shell.index') {
                            return 'index-wrapper';
                        } else {
                            return 'flex-wrapper';
                        }
                    }
                };

                app.closePopup = $rootScope.closePopup;

                app.toggleLoading = function (isShow) {
                    $rootScope.showLoading = angular.isUndefined(isShow) ? !$rootScope.showLoading : isShow;
                    if ($rootScope.showLoading) {
                        $('#loading').attr('style', '');
                    }
                };

                app.showPopup = function (msg, noAuth) {
                    $rootScope.showGlobalPopup = true;
                    $rootScope.popupMsg = msg || $rootScope.popupMsg;
                    $rootScope.noAuth = !!noAuth;
                };
                app.showNote = function (msg, noAction) {
                    if (msg !== undefined && noAction) {
                        $rootScope.noAction = true;
                        $rootScope.showGlobalPopup = true;
                        $rootScope.popupMsg = msg || $rootScope.popupMsg;
                        $('#error-message').css({
                            'top': '20%'
                        });
                        $('#error-message .modal-body').css({
                            'color': '#4F94CD'
                        });
                        $timeout(() => {
                            $rootScope.showGlobalPopup = false;
                            $rootScope.noAction = false;
                            $('#error-message .modal-body').css({
                                'color': '#333'
                            });
                        }, 2500);
                    }
                };
                app.forceShowLoading = function (isShow) {
                    $rootScope.forceShowLoading = isShow;
                    if ($rootScope.forceShowLoading) {
                        $('#loading').attr('style', '');
                    }
                    // console.log($rootScope.forceShowLoading);
                };
                app.showNoteNotAutoClose = function (noAction, msg) {
                    if (msg !== undefined && noAction) {
                        $rootScope.noAction = true;
                        $rootScope.showGlobalPopup = true;
                        $rootScope.popupMsg = msg || $rootScope.popupMsg;
                        $('#error-message').css({
                            'margin-top': '200px'
                        });
                        $('#error-message .modal-body').css({
                            'color': '#4F94CD'
                        });
                    } else if (msg === undefined && !noAction) {
                        $rootScope.showGlobalPopup = false;
                        $rootScope.noAction = false;
                        $('#error-message .modal-body').css({
                            'color': '#333'
                        });
                    }
                };

                app.showConfirm = function (msg, callback) {
                    $rootScope.noCloseBtn = false;
                    $rootScope.confirmHandle = callback || app.closePopup;
                    app.showPopup(msg);
                };

                app.forward = function (hash) {
                    location.hash = hash;
                };

                app.getUserInfo = function (key) {
                    return key ? $rootScope.userInfo[key] : $rootScope.userInfo;
                };

                // global error handle
                window.onerror = function (errorMsg, filePath, line, col, errorObj) {
                    app.showPopup(errorMsg + '\n' + filePath + '\nline:' + line + ' col:' + col);
                };

                $('body').on('click', '#error-message', () => {
                    $rootScope.closePopup();
                });
                // 获取用户信息name & token
                $.ajax({
                    method: 'get',
                    async: false,
                    data: {
                        curUrl: window.location.href
                    },
                    url: servicesConfig.USER.getUser.url,
                    contentType: 'application/json',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                }).then(function (data) {
                    switch (data.status) {
                        case 200: //success
                            let curMsg = data.message;
                            console.log(curMsg);
                            let goToReg = /^\[ajax-redirected\]=>(.*)/g;
                            let matchArr = goToReg.exec(curMsg);
                            if (matchArr !== null) {
                                console.log(matchArr[1]);
                                window.location.href = matchArr[1];
                            } else {
                                app.userInfo = data.data;
                                $rootScope.userInfo = data.data;
                                $rootScope.userInfo.password = data.data.pwd;
                            }
                            break;
                        default: // other error
                            app.showPopup(data.message || '未知错误');
                            break;
                    }
                    // ajax-redirected 302重定向
                    // if (data.status === 0) {
                    //     app.userInfo = data.result;
                    //     $rootScope.userInfo = data.result;
                    // }
                    // else if (data.status === 2 || /ajax-redirected/i.test(data.message)) {
                    //     location.reload();
                    // }
                    // else if (data.status === 3) {
                    //     app.showPopup(data.message || '无权限', true);
                    // }
                    // else {
                    //     app.showPopup(data.message || '未知错误');
                    // }
                });
                let wrapperDom = $('.wrapper');
                $rootScope.$on('onresize', (d, value) => {
                    if (value === 'big') {
                        wrapperDom.removeClass('small').addClass('big');
                    } else {
                        wrapperDom.removeClass('big').addClass('small');
                    }
                });
            }
        ]
    );