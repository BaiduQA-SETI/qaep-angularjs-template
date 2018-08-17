/**
 * @file BaseModel
 * @author zhangzengwei@baidu.com
 */
import angular from 'angular';

class BaseModel {
    constructor($http, config) {
        this.$http = $http;
        this.config = config || {};
        this.initMethodsByConfig(this.config);
        this.app = angular.module('app');
    }

    excute(config, callback, errorCallback, oCtx) {
        let that = this;
        // let _onError = errorCallback || this.errorHandle.bind(this);
        that.app.toggleLoading(true && config.showLoading !== false);
        this.$http(config).success(function (response) {
            // response.info = that.getInfoWithString(response.info);
            switch (response.status || response.success) {
                case true: //success
                    callback && callback.call(oCtx, response.data || response.result, response);
                    break;
                case 200:
                    // callback && callback.call(oCtx, response.data || response.result, response);
                    if (response.success !== undefined && response.success) {
                        callback && callback.call(oCtx, response.data || response.result, response);
                    } else {
                        that.app.showPopup(response.info || response.message || response.statusInfo || '未知错误');
                        callback && callback.call(oCtx, response.data || response.result, response);
                    }
                    break;
                default: // other error
                    that.app.showPopup(response.info || response.message || response.statusInfo || '未知错误');
                    errorCallback && errorCallback(response.info || response.message || response.statusInfo || '未知错误');
                    // _onError(that.getInfoWithString(response.message), status);
                    break;
            }

            // switch (response.status) {
            //     case 0: // sucess
            //         callback && callback.call(oCtx, response.data || response.result, response);
            //         break;
            //     case 2: // 302 redirect
            //         location.reload();
            //         break;
            //     case 3: // no auth
            //         that.app.showPopup(response.message || '无权限', true);
            //         break;
            //     default: // other error
            //         that.app.showPopup(response.message || '未知错误');
            //         // _onError(that.getInfoWithString(response.message), status);
            //         break;
            // }
            // console.log(123);
            that.app.toggleLoading(false);
        }).error(function (data, status) {
            that.errorHandle(that.getErrorMsg(data, status), status);
            that.app.toggleLoading(false);
        });
    }

    errorHandle(data, status, headers, config) {
        this.app.showPopup(this.getErrorMsg(data, status, headers, config));
        this.app.toggleLoading(false);
    }

    getErrorMsg(data, status, headers, config) {
        let errorMsg = 'status: ' + status + '\n';

        errorMsg += angular.isObject(data) ? JSON.stringify(data, null, 4) : data;

        return errorMsg;
    }

    getInfoWithString(info) {
        let msg = '';

        if (angular.isObject(info)) {
            for (let key in info) {
                msg += info[key] + ';';
            }
            msg = msg.substring(0, msg.length - 1);
        }
        else {
            msg = info;
        }

        return msg;
    }

    buildUrl(url, params) {
        let hasParamReg = /{.*}/i;

        // url += (url.indexOf('?') > -1 ? '&' : '?') + 'username={username}&token={token}';
        // angular.extend(params, app.userInfo);

        if (hasParamReg.test(url)) {
            for (let key in params) {
                let reg = new RegExp('{' + key + '}', 'i');
                if (hasParamReg.test(url) && reg.test(url)) {
                    url = url.replace(reg, params[key]);
                    delete params[key];
                }
            }
        }
        return url;
    }

    initMethodsByConfig(config) {
        let that = this;
        let value = '';

        for (let key in config) {
            value = config[key];

            if (angular.isObject(value)) {
                this[key] = (function (value) {
                    return function (params, callback, errorCallback, oCtx) {
                        let showLoading = (params || {}).showLoading;
                        delete params.showLoading;
                        params = angular.copy(params);
                        for (let pmkey in params) {
                            if (params[pmkey] === '') {
                                params[pmkey] = null;
                            }
                        }
                        that.excute({
                            showLoading: showLoading,
                            method: (value.method || 'get'),
                            url: this.buildUrl(value.url, params),
                            data: params,
                            params: /get/i.test(value.method) ? params : ''
                        }, callback, errorCallback, oCtx);
                    };
                })(value);
            }
        }
    }

    clone(config) {
        return new BaseModel(this.$http, config);
    }

    setConfig(config) {
        this.initMethodsByConfig(config);
        return this;
    }
}

BaseModel.$inject = ['$http'];

export default angular.module('app.basemodel', [])
    .service('BaseModel', BaseModel)
    .name;
