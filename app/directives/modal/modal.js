/**
 * @file select directive
 * @author zhangzengwei@baidu.com
 */
import './modal.less';
// 引用此指令时的配置结构
// xxxx: {
//     show: 'init',
//     title: '性能任务对比图',
//     button: [
//         {
//             name: '确认',
//             value: 'confirm',
//             highLight: true,
//             afterIsClose: false
//         },
//         {
//             name: '关闭',
//             value: 'close'
//         }
//     ],
//     click: (pm) => {
//         console.log(pm);
//     }
// }
export default class ModalPanel {
    constructor() {
        this.restrict = 'EA';
        this.transclude = true;
        this.scope = {
            myData: '='
        };
        this.template = require('./modal.html');
    }

    link(scope, element, attrs) {
        scope.triggerBtn = pm => {
            if (typeof pm === 'string') {
                scope.myData.show = false;
                if (pm === 'close' || pm === 'closeTag') {
                    if (scope.myData.click !== undefined) {
                        scope.myData.click(pm);
                    }
                }
            } else {
                if (pm.afterIsClose !== false) {
                    scope.myData.show = false;
                }
                if (scope.myData.click !== undefined) {
                    scope.myData.click(pm);
                }
            }
        };
    }
}
