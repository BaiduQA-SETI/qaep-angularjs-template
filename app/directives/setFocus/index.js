/**
 * @file compile directive entry
 * @author zhangyou04@baidu.com
 */
import angular from 'angular';
import SetFocusDirective from './setFocus';

export default angular.module('directives.setFocus', [])
    .directive('setFocus', SetFocusDirective.getInstance)
    .name;
