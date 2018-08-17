/**
 * @file newtab routers
 * @author zhangzengwei@baidu.com
 */
import utility from '../../services/utility';
routes.$inject = ['$stateProvider'];

export default function routes($stateProvider) {
    $stateProvider.state('shell.newtab', {
        url: 'newtab',
        views: {
            'content@': {
                template: require('./newtab.html'),
                controller: 'NewtabController as newtab',
                resolve: {
                    // modules: utility.loadModules([require('./index.controller')])
                    modules: [
                        '$q',
                        '$ocLazyLoad',
                        ($q, $ocLazyLoad) => $q(resolve => {
                            require.ensure([], () => {
                                let module = require('./newtab.controller');
                                $ocLazyLoad.load({name: module.name || module.default.name});
                                resolve(module);
                            }, 'newtab.bundle');
                        })
                    ]
                }
            }
        }
    });
}
