/**
 * @file line chart directive
 * @author zhangzengwei
 */
import echarts from 'echarts';
import 'echarts/theme/macarons.js';
import dateAdapter from './dateAdapter';
import './echart.less';

class EchartDirective {
    constructor($timeout) {
        this.restrict = 'EA';
        // this.transclude = true;
        this.replace = true;
        this.scope = {
            myOption: '=',
            myClick: '='
            // beforeDraw: '='
        };
        this.template = require('./echart.html');
        this.$timeout = $timeout;
        // this.template = '<div style="height:100%;width: 100%;"></div>';
    }

    link(scope, element, attrs) {
        let self = this;
        let myEchart = null;
        // scope.chartDom = null;
        scope.$watch('myOption', option => {
            self.$timeout(() => {
                let chartDom = element.find('.chart-dom');
                if (option !== null) {
                    if (chartDom.attr('_echarts_instance_') === undefined) {
                        let theme = option.theme || {
                            line: {
                                smooth: true
                            }
                        };
                        myEchart = echarts.init(chartDom[0], theme);
                        // myEchart = echarts.init(chartDom[0], {
                            // line: {
                            //     smooth: true
                            // }
                        // });
                        // myEchart.setTheme(macarons);
                    }
                    if (scope.myClick !== undefined && scope.myClick !== '') {
                        myEchart.on('click', function (params) {
                            scope.myClick(params);
                        });
                    }
                    myEchart.setOption(option);
                    scope.$on('onresize', (d, value) => {
                        let chartDomHtml = '<div class="chart-dom">'
                            + '<span>无数据!</span>'
                            + '</div>';
                        element.html(chartDomHtml);
                        self.$timeout(() => {
                            let chartDom = element.find('.chart-dom');
                            let theme = option.theme || {
                                line: {
                                    smooth: true
                                }
                            };
                            myEchart = echarts.init(chartDom[0], theme);
                            myEchart.setOption(option);
                            // scope.myEchart.resize();
                        }, 50);
                    });
                } else if (option === null) {
                    let chartDomHtml = '<div class="chart-dom">'
                        + '<span>无数据!</span>'
                        + '</div>';
                    if (chartDom.attr('_echarts_instance_') !== undefined) {
                        chartDom.remove();
                        element.html(chartDomHtml);
                    }
                }
            }, 100);
        });

        // scope.$watch('option.refreshId', refreshId => {
        //     if (refreshId) {
        //         this.drawChart(scope.option, element);
        //     }
        // });
    }
    static getInstance($timeout) {
        EchartDirective.instance = new EchartDirective($timeout);
        return EchartDirective.instance;
    }
    // drawChart(option, element, scope) {
        // if (dateAdapter.checkChartDataEmpty(data)) {
        //     element.html([
        //         '<div class="empty-chart">',
        //         '   <h5>' + data.title + '</h5>',
        //         '   <p>暂无数据，如有查询条件请设置条件</p>',
        //         '</div>'
        //     ].join(''));
        //     return this;
        // }

        // let option = angular.copy(data);
        // option = dateAdapter.generateChartData(data);
        // console.log(option);
        // scope.beforeDraw && scope.beforeDraw(option);
        // echarts.init(element[0], {
        //     line: {
        //         smooth: true
        //     }
        // }).setOption(option);
    // }
}
EchartDirective.getInstance.$inject = ['$timeout'];

module.exports = EchartDirective;
