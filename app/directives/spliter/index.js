import SpliterDirective from './spliter';

export default angular.module('directives.spliter', [])
	.directive('spliterDt', () => new SpliterDirective())
	.name;