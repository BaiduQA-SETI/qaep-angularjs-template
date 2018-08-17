/**
 * @file dialog directive
 * @author zhangzengwei@baidu.com
 */
import './upload.less';

class UploadDirective {
    constructor() {
        this.restrict = 'EA';
        this.transclude = true;
        this.scope = {
            upload: '=',
            uploadFunc: '='
        };
        this.template = require('./upload.html');
    }

    link(scope, element, attrs) {
        scope.uploadInfo = {
            status: 'init',
            filePath: scope.upload.text,
            // btnAble: scope.upload.btnAble || false,
            // browserBtnAble: false,
            // uploadBtnAble: true,
            fileType: scope.upload.type.split(',')
            // uploadNote: scope.upload.note || ''
        };
        console.log(scope.uploadInfo);
        console.log(scope.uploadInfo.filePath.split('.').length);

        scope.browserFile = (event) => {
            $('.file-elem', element).trigger('click');
        };
        scope.uploadFile = (event) => {
            let self = this;
            scope.uploadFunc(event);
            // scope.upload.browserBtnAble = true;
            // scope.upload.uploadBtnAble = true;
            // scope.upload.note = '上传中...';
            // let formData = new FormData();
            // let file = $('.file-elem', element)[0].files[0];
            // formData.append('apk', file);
            // this.$http({
            //     method: 'POST',
            //     url: scope.upload.url,
            //     data: formData,
            //     headers: {'Content-Type': undefined},
            //     transformRequest: angular.identity
            // })
            // .success((response) => {
            //     scope.upload.browserBtnAble = false;
            //     if (response.status) {
            //         // scope.upload.uploadBtnAble = true;
            //         scope.upload.note = '上传成功!';
            //         scope.callback(response);
            //     } else {
            //         scope.upload.uploadBtnAble = false;
            //         scope.upload.note = '上传失败,请重新上传!';
            //         self.app.showPopup(response.info || '未知错误');
            //     }
            // })
            // .error((response) => {
            //     scope.upload.browserBtnAble = false;
            //     scope.upload.uploadBtnAble = false;
            //     scope.upload.note = '上传失败,请重新上传!';
            //     self.app.showPopup(response || '未知错误');
            // });
        };
        $('.file-elem', element).on('change', (event) => {
            let filePath = event.target.value;
            let fileExtensionName = filePath.split('.').pop().toLowerCase();
            let isCorrectType = scope.uploadInfo.fileType.indexOf(fileExtensionName);
            scope.upload.note = '';
            scope.$apply(() => {
                if (isCorrectType < 0) {
                    scope.uploadInfo.filePath = '文件格式不对,请重新选择!';
                    scope.uploadInfo.status = 'error';
                } else {
                    scope.uploadInfo.filePath = event.target.value;
                    scope.upload.uploadBtnAble = false;
                    scope.uploadInfo.status = 'correct';
                }
            });
        });
    }

    static getInstance() {
        UploadDirective.instance = new UploadDirective();
        return UploadDirective.instance;
    }
}

UploadDirective.getInstance.$inject = [];

module.exports = UploadDirective;



