/**
 * @file newtab controller
 * @author zhangzengwei@baidu.com
 */
import './newtab.less';
import angular from 'angular';
import serviceConfig from '../../servicesConfig';

class NewtabController {
    constructor($scope, $state, $interval, model) {
        let self = this;
        this.$state = $state;
        // this.model = model.setConfig(serviceConfig.INDEX);
    }
}

NewtabController.$inject = ['$scope', '$state', '$interval', 'BaseModel'];

export default angular
    .module('newtab.controller', [])
    .controller('NewtabController', NewtabController);

