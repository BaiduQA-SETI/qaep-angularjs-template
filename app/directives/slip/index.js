/**
 * @file 左右滑动
 * @author zhangzengwei@baidu.com
 */

import angular from 'angular';
import SlipDirective from './slip';

export default angular.module('directives.slip', [])
    .directive('slip', SlipDirective.getInstance)
    .name;