module.exports = {
    types: ['line', 'graph', 'pie', 'bar', 'funnel', 'radar', 'gauge', 'bar'],
    getChartTypeName(typeNum) {
        return ['line', 'graph', 'pie', 'bar', 'funnel', 'radar', 'gauge', 'bar'][typeNum - 1] || 'line';
    },
    generateChartData(chart) {
        if (!chart) {
            console.warn('chart data shoun\'t be null');
            return null;
        }
        let that = this;
        let types = this.types;
        let type = types[+chart.type - 1];
        let option = {
            title: {
                text: chart.title || chart.name,
                subtext: chart.subTitle || '',
                x: 'center',
                textStyle: {
                    fontFamily: 'ff-tisa-web-pro-1, ff-tisa-web-pro-2, Lucida Grande,'
                        + 'Helvetica Neue, Helvetica, Arial, Hiragino Sans GB, Hiragino Sans GB W3,'
                        + 'Microsoft YaHei UI,Microsoft YaHei, WenQuanYi Micro Hei, sans-serif'
                },
                subtextStyle: {
                    color: '#ae5da1'
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: []
            },
            calculable: true
        };
        let axisLine = {
            show: true,
            onZero: true,
            lineStyle: {
                width: 1,
                color: '#333',
                type: 'solid'
            }
        };
        let tooltip = {
            trigger: 'axis',
            backgroundColor: 'rgba(0,0,0,.5)',
            textStyle: {
                color: '#fff',
                fontSize: 14,
                lineHeight: 30
            },
            axisPointer: {
                type: 'line',
                lineStyle: {
                    type: 'dashed',
                    color: '#666',
                    width: 2
                }
            }
        };
        let getXName = function (chart) {
            return chart.data && chart.data.xname || (chart.xname || '');
        };
        let getYName = function (chart) {
            return chart.data && chart.data.yname || (chart.yname || '');
        };
        let nameTextStyle = {
            color: '#ae5da1'
        };
        let xAxis = [{
            name: getXName(chart), // chart.xname || chart.data.xname,
            nameTextStyle: nameTextStyle,
            type: 'category',
            boundaryGap: false,
            data: chart.data && chart.data.xdata ? chart.data.xdata : [],
            axisLabel: {
                formatter: '{value}' + (chart.xUnit ? chart.xUnit : '')
            },
            axisLine: axisLine,
            boundaryGap: ['20%', '20%']
        }];
        chart.data.yAxis = chart.data.yAxis || [{
            name: getYName(chart),
            unit: chart.unit || chart.yUnit || ''
        }];
        let yAxis = chart.data.yAxis.map(item => {
            return {
                name: item.name,
                type: 'value',
                // nameTextStyle: nameTextStyle,
                scale: true,
                axisLabel: {
                    formatter: '{value} ' + (item.unit || '')
                },
                axisLine: $.extend(true, axisLine, {lineStyle: {width: 1}})
            };
        });
        // let start;
        let total;
        let chartType = types.indexOf(chart.type);

        chartType = chartType === -1 ? +chart.type : (chartType + 1);
        type = types[chartType - 1];
        switch (chartType) {
            case 1: // line
                $.extend(option, {
                    dataZoom: [{
                        type: 'slider',
                        show: true,
                        xAxisIndex: 0,
                        start: 0,
                        end: 50
                    }],
                    tooltip: tooltip,
                    legend: {
                        x: 'center',
                        y: '35',
                        data: ((chart.data && chart.data.series) || []).map(function (item, i) {
                            return item.name || i;
                        })
                    },
                    xAxis: xAxis,
                    yAxis: yAxis,
                    series: this.generateSeries(chart && chart.data && chart.data.series, type, chart)
                });

                // start = parseInt((15 / option.series[0].data.length) * 100);

                // start = option.series[0].data.length < 15 ? 0 : Math.min(100, 100 - start);
                // option.dataZoom[0].start = start;

                // lengend大于5个则可能换行 需调整图标的Y轴坐标
                if (option.legend && option.legend.data
                    && option.legend.data.length > 7) {
                    option.grid = {
                        x: 40,
                        y: 60 + (Math.ceil(option.legend.data.length / 7) - 1) * 30
                    };
                }
                this.generateColorsForChart(option, 1);
                break;
            case 3: // pie
                $.extend(option, {
                    title: {
                        x: 'center',
                        padding: 0,
                        text: chart.title || chart.name,
                        subtext: chart.subTitle || '',
                        subtextStyle: {
                            color: '#ae5da1'
                        }
                    },
                    legend: {
                        itemGap: chart.data.length > 5 ? 10 : 30,
                        orient: chart.data.length > 5 ? 'vertical' : 'horizontal',
                        selectedMode: false,
                        x: chart.data.length > 5 ? 'right' : 'center',
                        y: 'bottom',
                        data: (chart.data || []).map(item => item.name)
                    },
                    calculable: false,
                    tooltip: {
                        trigger: 'item',
                        formatter: '{b} : {c} ({d}%)'
                    },
                    series: [{
                        name: '',
                        type: type,
                        radius: '52%',
                        center: ['50%', '50%'],
                        data: chart.data || []
                    }]
                });
                this.generateColorsForChart(option, 3);
                break;
            case 4: // 柱状图
                $.extend(option, {
                    xAxis: xAxis,
                    yAxis: yAxis,
                    legend: {
                        y: 'bottom',
                        data: ((chart.data && chart.data.series) || []).map(function (item, i) {
                            return item.name || i;
                        })
                    },
                    series: this.generateSeries(chart && chart.data && chart.data.series, type, chart)
                });

                total = option.series.length * option.series[0].data.length;
                if (total > 30) {
                    option.dataZoom = {
                        show: true,
                        start: 0,
                        end: (30 / total) * 100,
                        // width: '',
                        // height: 20,
                        // backgroundColor: '#e6e6e6',
                        dataBackgroundColor: '#e6e6e6',
                        fillerColor: '#f8f8f8',
                        handleColor: '#ae5da1'
                        // handleSize: 40
                    };

                    option.legend.y = option.title && option.title.subtext ? '45' : '30';
                    // option.legend.x = 'right';
                    // option.legend.orient = 'vertical';
                }

                this.generateColorsForChart(option, 4);
                break;
            case 5: // 漏斗图
                $.extend(option, {
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        x: 'center',
                        y: 'bottom',
                        data: (chart.data || []).map(item => item.name)
                    },
                    series: [{
                        name: chart.title,
                        type: type,
                        data: chart.data || []
                    }]
                });
                break;
            case 6: // 雷达图
                $.extend(option, {
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        orient: 'vertical',
                        x: 'right',
                        y: 'top',
                        data: (chart.data.series || []).map(item => item.name)
                    },
                    polar: [{
                        center: ['50%', '55%'],
                        indicator: chart.data.polor.map(item => {
                            return {text: item};
                        })
                    }],
                    series: [
                        {
                            name: chart.title,
                            type: type,
                            data: (chart.data.series || []).map(item => {
                                return {
                                    name: item.name,
                                    value: that.valsToNumber(item.vals)
                                };
                            })
                        }
                    ]
                });
                break;
            case 7: // 仪表盘
                $.extend(option, {
                    series: [{
                        name: chart.title,
                        type: type,
                        data: [chart.data]
                    }]
                });
                break;
            case 8: // 横向柱状图
                $.extend(option, {
                    tooltip: tooltip,
                    xAxis: xAxis,
                    yAxis: yAxis,
                    legend: {
                        y: 'bottom',
                        data: ((chart.data && chart.data.series) || []).map(function (item, i) {
                            return item.name || i;
                        })
                    },
                    series: this.generateSeries(chart && chart.data && chart.data.series, type, chart)
                });

                this.generateColorsForChart(option, 8);
                break;
        }

        return option;
    },
    generateColorsForChart(chart, type) {
        // let colors = ['#ffdb4b', '#ffa3e0', '#52e8df', '#ff9f32', '#c366eb', '#852758', '#ef4836', '#a8ccfd'/*, '#d2aeae'*/].reverse();
        let colors = [];
        switch (type) {
            // case 6: // radar
            case 3: // pie
                chart.series[0].data.forEach(function (item, i) {
                    if (colors[i]) {
                        item.itemStyle = item.itemStyle || {};
                        $.extend(item.itemStyle, {
                            normal: {
                                color: colors[i]
                            }
                        });
                    }
                });
                break;
            case 1: // line
            case 4: // bar
            case 8: // horizontal bar
                chart.series.forEach(function (item, i) {
                    if (colors[i]) {
                        item.itemStyle = item.itemStyle || {};
                        $.extend(item.itemStyle, {
                            normal: {
                                color: colors[i]
                            }
                        });
                    }
                });
                break;
        }

        return chart;
    },
    generateSeries(series, type, chart) {
        let that = this;
        return (series || []).map((item, i) => {
            return $.extend(item, {
                name: item.name || i,
                type: item.type ? that.getChartTypeName(item.type) : type,
                data: that.valsToNumber(item.vals || []),
                pic: item.pic || []
            }, type === 'bar' ? {
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            textStyle: {
                                color: '#333'
                            },
                            formatter(params, ticket, callback) {
                                // '{c}' + ((chart.type === 4 ? chart.yUnit : chart.xUnit) || '')
                                // let unit = (chart.type === 4 ? chart.yUnit : chart.xUnit) || '';

                                if (series && series[0] && series[0].stack) {
                                    if (i === series.length - 1) {
                                        let total = 0;
                                        for (let k = 0; k < series.length; k++) {
                                            total += +series[k].vals[chart.data.xdata.indexOf(params.name)] || 0;
                                        }
                                        return total;
                                    }
                                    return '';
                                }
                                return params.value;
                            }
                        }
                    }
                }
            } : {});
        });
    },
    valsToNumber(vals) {
        return (vals || []).map(val => {
            return val == null ? 0 : (val === '-' ? val : parseFloat(val, 10));
        });
    },
    checkChartDataEmpty(chart) {
        if (!chart || !chart.type) {
            return true;
        }

        switch (+chart.type) {
            case 1:
            case 4:
            case 8:
                return !(chart.data && chart.data.series && chart.data.series[0]
                    && chart.data.series[0].vals && chart.data.series[0].vals.length > 0);
            case 3:
                if (!chart.data) {
                    return true;
                }
                for (let i = 0; i < (chart.data || []).length; i++) {
                    if (+(chart.data[i] || {}).value !== 0) { // 有任意一个不为0的值则非空
                        return false;
                    }
                }
                return true;
            case 5:
                return !(chart.data);
            case 6:
                return !(chart.data && chart.data.polor && chart.data.polor.length > 0);
            case 7:
                return !(chart.data);
        }
        return false;
    }
};
