/**
 * @file point to time directive
 * @author zhangzengwei@baidu.com
 */
import angular from 'angular';
import PointToTimeQuantityDirective from './pointToTimeQuantity';

export default angular.module('directives.pointToTime', [])
	.directive('pointToTime', PointToTimeQuantityDirective.getInstance)
	.name;