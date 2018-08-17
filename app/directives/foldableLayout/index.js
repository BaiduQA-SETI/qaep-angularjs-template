/**
 * @file  foldable width height layout
 * @author zhangzengwei@baidu.com
 */
import angular from 'angular';
import FoldableDirective from './foldable';

export default angular.module('directives.foldable', [])
    .directive('foldable', FoldableDirective.getInstance)
    .name;