/**
 * @file dialog entry
 * @author zhangyou04@baidu.com
 */
import angular from 'angular';
import DialogDirective from './dialog';

export default angular.module('directives.dialog', [])
    .directive('dialog', DialogDirective.getInstance)
    .name;
