/**
 * @file index entry
 * @author zhangzengwei@baidu.com
 */
import angular from 'angular';
import routing from './index.routes';

export default angular.module('app.index', [])
    .config(routing)
    .name;
