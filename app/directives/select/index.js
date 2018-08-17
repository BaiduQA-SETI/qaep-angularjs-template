import angular from 'angular';
import SelectDirective from './select';

export default angular.module('directives.select', [])
    .directive('selectList', SelectDirective.getInstance)
    .name;