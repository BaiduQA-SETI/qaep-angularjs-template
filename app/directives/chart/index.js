import angular from 'angular';
import EchartDirective from './echart';

export default angular.module('directives.echart', [])
    // .directive('echart', () => new EchartDirective())
    .directive('echart', EchartDirective.getInstance)
    .name;