import angular from 'angular';
import DateFromatDirective from './dateFormat';

export default angular.module('directives.dateFormat', [])
	.directive('dateFormat', DateFromatDirective.getInstance)
	.name;