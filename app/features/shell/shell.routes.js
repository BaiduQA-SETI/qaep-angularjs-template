/**
 * @file shell routes
 * @author zhangyou04@baidu.com
 */
routes.$inject = ['$stateProvider', '$controllerProvider'];

export default function routes($stateProvider, $controllerProvider) {
    $stateProvider.state('shell', {
        url: '/',
        views: {
            header: {
                template: require('./header.html'),
                controller: 'ShellController as shell'
            },
            content: {},
            footer: {
                template: require('./footer.html'),
                controller: 'ShellController as shell'
            }
        },
        controller: 'ShellController',
        controllerAs: 'shell'
    });
}
