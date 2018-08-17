import angular from 'angular';
import PaginationDirective from './pagination';

export default angular.module('directives.pagination', [])
	.directive('pagination', () => new PaginationDirective())
	.name;