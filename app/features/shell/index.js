/**
 * @file shell entry
 * @author  zhangyou04@baidu.com
 */
import angular from 'angular';
import uirouter from 'angular-ui-router';
import routes from './shell.routes';
import ShellController from './shell.controller';

export default angular.module('app.shell', [uirouter])
    .config(routes)
    .controller('ShellController', ShellController)
    .name;
