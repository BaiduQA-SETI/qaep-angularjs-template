/**
 * @file show vertical on hover directive
 * @author zhangzengwei@baidu.com
 */
import angular from 'angular';
import ShowVerticalOnHover from './showVerticalOnHover';

export default angular.module('directives.showVerticalOnHover', [])
    .directive('showVerticalOnHover', () => new ShowVerticalOnHover())
    .name;