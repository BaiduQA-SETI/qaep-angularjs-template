/**
 * @file modal panel directive
 * @author zhangzengwei@baidu.com
 */
import angular from 'angular';
import ModalPanel from './modal';

export default angular.module('directives.modal', [])
    .directive('modalPanel', () => new ModalPanel())
    .name;