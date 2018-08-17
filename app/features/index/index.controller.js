/**
 * @file index controller
 * @author zhangzengwei@baidu.com
 */
import './index.less';
import angular from 'angular';
import carousel from '../../directives/carousel';
import serviceConfig from '../../servicesConfig';

class IndexController {
    constructor($scope, $state, $interval, model) {
        let self = this;
        this.$state = $state;
        this.model = model.setConfig(serviceConfig.INDEX);
        this.carouselData = {
            type: 'img',
            list: [
                {
                    id: 'carousel1',
                    src: '/img/carousel1.png'
                },
                {
                    id: 'carousel2',
                    src: '/img/carousel2.png',
                    btnInfo: [
                        {
                            name: 'knowMore',
                            top: '51%',
                            left: '5%',
                            width: '238px',
                            height: '62px',
                            text: '了解更多',
                            icon: 'fa fa-chevron-right',
                            click: pm => {
                                console.log('click', pm);
                                self.$state.go('shell.solution', {type: 'robot'}, {
                                    location: true,
                                    reload: false,
                                    inherit: false,
                                    notify: true
                                });
                            }
                        }
                    ]
                }
            ]
        };
        
        this.getDemoData();
        $scope.$on('onresize', () => {
            
        });
    }

    // HTTP调用部分
    // 获取合作统计数据
    getDemoData() {
        let self = this;
        self.model.getDemoData(
            {},
            data => {
                console.log(data);
            }
        );
    }
}

IndexController.$inject = ['$scope', '$state', '$interval', 'BaseModel'];

export default angular
    .module('index.controller', [carousel])
    .controller('IndexController', IndexController);

