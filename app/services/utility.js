/**
 * @file utility
 * @author zhangzengwei@baidu.com
 */
module.exports = {
    loadModules(modules) {
        return [
            '$q',
            '$ocLazyLoad',
            ($q, $ocLazyLoad) => $q(resolve => {
                modules.forEach(module => {
                    require.ensure([], () => {
                        // load whole module
                        $ocLazyLoad.load({name: module.name || module.default.name});
                        resolve(module);
                    });
                });
            })
        ];
    },
    getDateTimeStr(date, separator, withTime) {
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        let addZero = function (num) {
            return num > 9 ? ('' + num) : '0' + num;
        };

        separator = separator || '-';

        return year + separator + addZero(month) + separator + addZero(day)
            + (withTime ? (' ' + addZero(hours) + ':' + addZero(minutes)
            + ':' + addZero(seconds)) : '');
    },
    generateDateTime(n, type) {
        let self = this;
        let curType = type || 'dateTime';
        let newDA = new Date(new Date() - 0 + n * 86400000);
        let month = newDA.getMonth() + 1;
        month = (month < 10) ? ('0' + month) : month;
        let day = (newDA.getDate() < 10) ? ('0' + newDA.getDate()) : newDA.getDate();
        let hour = (newDA.getHours() < 10) ? ('0' + newDA.getHours()) : newDA.getHours();
        let min = (newDA.getMinutes() < 10) ? ('0' + newDA.getMinutes()) : newDA.getMinutes();
        let sec = (newDA.getSeconds() < 10) ? ('0' + newDA.getSeconds()) : newDA.getSeconds();
        if (curType === 'dateOnly') {
            newDA = newDA.getFullYear() + '-' + month  + '-' + day;
        } else {
            newDA = newDA.getFullYear() + '-' + month  + '-' + day + ' ' + hour + ':' + min + ':' + sec;
        }
        return newDA + '';
    },
    generateMonth(n) {
        let self = this;
        let pm = n || 0;
        let newDA = new Date();
        let year = newDA.getFullYear();
        let month = newDA.getMonth() + 1;
        let newYear;
        let newMonth;
        if (month + pm > month && month + pm > 12) {
            newYear = year + 1;
            newMonth = month + pm - 12;
        } else if (month + n < month && month + pm < 1) {
            newYear = year - 1;
            newMonth = month + pm + 12;
        } else {
            newYear = year;
            newMonth = month + pm;
        }
        if (newMonth < 10) {
            newMonth = '0' + newMonth;
        }
        let ym = newYear + '-' + newMonth;
        return ym;
    },
    isMouseInDomArea(e, dom) {
        let x = e.clientX;
        let y = e.clientY;
        let offset = dom.offset();
        let width = dom.width();
        let height = dom.height();

        return !(x < offset.left || x > offset.left + width || y < offset.top || y > offset.top + height);
    },
    getFullPath() {
        return location.protocol + '//' + location.hostname
            + (location.port ? (':' + location.port) : '') + '/index.html';
    },
    scrollToTop(dom, top, animate) {
        dom = dom || document.body;
        top = typeof top === 'undefined' ? 0 : top;
        if (animate === false) {
            $(dom).scrollTop(top);
            if (dom.documentElement && dom.documentElement.scrollTop) {
                document.documentElement.scrollTop = top; // Firefox
            }
        }
        else {
            $(dom).animate({scrollTop: top}, 500);
            if (dom.documentElement) {
                $(dom.documentElement).animate({scrollTop: top}, 500); // Firefox
            }
        }
    },
    // 页面加载脚本判定函数
    loadScript(url, callback, opt) {
        let script = document.createElement('script');
        opt = opt || {};
        script.type = 'text/javascript';
        if (opt.charset) {
            script.charset = opt.charset;
        }
        if (opt.id) {
            script.id = opt.id;
        }

        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState === 'loaded' || script.readyState === 'complete') {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        }
        else {
            script.onload = function () {
                callback();
            };
        }
        script.src = url;
        document.body.appendChild(script);
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
            case 9:
                return !(chart.data && chart.data.series && chart.data.series.length
                    && chart.data.series[0] && chart.data.series[0].data && chart.data.series[0].data.length);
        }
        return false;
    },
    generateChartData(chart) {
        if (!chart) {
            // console.warn('chart data shoun\'t be null');
            return null;
        }
        let that = this;
        let types = ['line', 'pie', 'bar', 'funnel', 'radar', 'gauge', 'bar'];
        let type = types[+chart.type - 1];
        let option = {
            title: {
                text: chart.title,
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
                color: '#ddd',
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
        let start;
        let total;

        switch (+chart.type) {
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
                    xAxis: [
                        {
                            name: getXName(chart), // chart.xname || chart.data.xname,
                            nameTextStyle: nameTextStyle,
                            type: 'category',
                            boundaryGap: false,
                            data: chart.data && chart.data.xdata ? chart.data.xdata : [],
                            axisLabel: {
                                formatter: '{value}' + (chart.xUnit ? chart.xUnit : '')
                            },
                            axisLine: axisLine
                        }
                    ],
                    yAxis: [
                        {
                            name: getYName(chart), // chart.yname || chart.data.yname,
                            nameTextStyle: nameTextStyle,
                            type: 'value',
                            scale: true,
                            axisLabel: {
                                formatter: '{value} ' + (chart.unit || chart.yUnit || '')
                            },
                            axisLine: $.extend(true, axisLine, {lineStyle: {width: 0}})
                        }
                    ],
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
                        text: chart.title,
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
                    xAxis: [
                        {
                            name: getXName(chart), // chart.data && chart.data.xname || chart.xname || '',
                            nameTextStyle: nameTextStyle,
                            type: 'category',
                            // boundaryGap : false,
                            data: chart.data && chart.data.xdata ?  chart.data.xdata : [],
                            axisLabel: {
                                formatter: '{value}' + (chart.xUnit || '')
                            },
                            axisLine: axisLine
                        }
                    ],
                    yAxis: [
                        {
                            name: getYName(chart), // chart.data && chart.data.yname || chart.yname || '',
                            nameTextStyle: nameTextStyle,
                            type: 'value',
                            axisLabel: {
                                formatter: '{value}' + (chart.yUnit || '')
                            },
                            axisLine: $.extend(true, axisLine, {lineStyle: {width: 0}})
                        }
                    ],
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
                        handleColor: '#ae5da1',
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
                        indicator: chart.data.polor.map(function (item) {
                            return {
                                text: item
                            };
                        })
                    }],
                    series: [
                        {
                            name: chart.title,
                            type: type,
                            data: (chart.data.series || []).map(function (item) {
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
                    xAxis: [
                        {
                            name: getXName(chart), // chart.data && chart.data.xname || chart.xname || '',
                            nameTextStyle: nameTextStyle,
                            type: 'value',
                            axisLabel: {
                                formatter: '{value}' + (chart.xUnit || '')
                            },
                            axisLine: axisLine
                        }
                    ],
                    yAxis: [
                        {
                            name: getYName(chart), // chart.data && chart.data.yname || chart.yname || '',
                            nameTextStyle: nameTextStyle,
                            type: 'category',
                            data: chart.data.yAxis || [],
                            axisLabel: {
                                formatter: '{value}' + (chart.yUnit || '')
                            },
                            axisLine: $.extend(true, axisLine, {lineStyle: {width: 0}})
                        }
                    ],
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
            case 9:
            $.extend(option, {
                tooltip: tooltip,
                calculable: true,
                xAxis: [
                    {
                        type: 'category',
                        data: chart.data.xAxis || [],
                        axisLine: axisLine
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: '数量',
                        axisLabel : {
                            formatter: '{value}' + (chart.yUnit || '')
                        },
                        axisLine: axisLine
                    },
                    {
                        type: 'value',
                        name: '闭环率',
                        axisLabel : {
                            formatter: '{value}' + (chart.yUnit || '%')
                        },
                        axisLine: axisLine
                    }
                ],
                legend: {
                    y: 'bottom',
                    data: ((chart.data && chart.data.series) || []).map(function (item, i) {
                        return item.name || i;
                    })
                },
                series: chart.data.series.map(function (item) {
                    item.data = (item.data || []).map(function (subItem) {
                        return subItem === null ? '-' : subItem;
                    });
                    if (item.type === 'line') {
                        item.yAxisIndex = 1;
                    }
                    return item;
                })

            });
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

        return (series || []).map(function (item, i) {
            return $.extend(item, {
                name: item.name || i,
                type: type,
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
                            formatter: function (params, ticket, callback) {
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
        return (vals || []).map(function (val) {
            return val == null ? 0 : (val === '-' ? val : parseFloat(val, 10));
        });
    }
};
