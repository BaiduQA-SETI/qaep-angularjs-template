/**
 * @file 轮播
 * @author zhangzengwei@baidu.com
 */

import angular from 'angular';
import CarouselDirective from './carousel';

export default angular.module('directives.carousel', [])
    .directive('carousel', CarouselDirective.getInstance)
    .name;