/**
 * @file compile directive entry
 * @author zhangzengwei@baidu.com
 */
import angular from 'angular';
import CompileDirective from './compile';

export default angular.module('directives.compile', [])
    .directive('compile', CompileDirective.getInstance)
    .name;
