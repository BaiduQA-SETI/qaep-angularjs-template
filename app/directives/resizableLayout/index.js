/**
 * @file resizableLayout entry
 * @author zhangyou04@baidu.com
 */
import angular from 'angular';
import {ResizableLayoutDirective, LayoutTopDirective, LayoutCenterDirective,
        LayoutBottomDirective, LayoutLeftDirective, LayoutRightDirective,
        LayoutSpliterDirective} from './layout';

export default angular.module('directives.resizableLayout', [])
    .directive('layout', () => new ResizableLayoutDirective())
    .directive('layoutTop', LayoutTopDirective.getInstance)
    .directive('layoutCenter', () => new LayoutCenterDirective())
    .directive('layoutBottom', LayoutBottomDirective.getInstance)
    .directive('layoutLeft', LayoutLeftDirective.getInstance)
    .directive('layoutRight', () => new LayoutRightDirective())
    .directive('layoutSpliter', () => new LayoutSpliterDirective())
    .name;
