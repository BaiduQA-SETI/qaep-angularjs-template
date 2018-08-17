/**
 * @file newtab entry
 * @author zhangzengwei@baidu.com
 */
import angular from 'angular';
import routing from './newtab.routes';

export default angular.module('app.newtab', [])
    .config(routing)
    .name;
