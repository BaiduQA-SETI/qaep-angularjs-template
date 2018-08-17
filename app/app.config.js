/**
 * @file app config
 * @author zhangzengwei@baidu.com
 */
import 'angular';

config.$inject = ['$urlRouterProvider', '$locationProvider', '$mdThemingProvider'];

export default function config($urlRouterProvider, $locationProvider, $mdThemingProvider) {
    $locationProvider.html5Mode(false);
    $urlRouterProvider.otherwise('/index');

    $mdThemingProvider.theme('default')
        .primaryPalette('teal', {
            default: 'A700', // by default use shade 400 from the pink palette for primary intentions
            'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
            'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
            'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
        })
        // If you specify less than all of the keys, it will inherit from the
        // default shades
        .accentPalette('teal', {
            default: 'A400' // use shade 200 for default, and keep all other shades the same
        });

    $mdThemingProvider.setDefaultTheme('default');
}
