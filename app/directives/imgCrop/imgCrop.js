/**
 * @file img-crop directive
 * @author zhangzengwei@baidu.com
 */
import './imgCrop.less';
import CropPubSubFactory from './cropPubSub';
import CropHostFactory from './cropHost';

class ImgCropDirective {
    constructor($timeout) {
        this.$timeout = $timeout;
        this.restrict = 'EA';
        this.replace = true;
        this.scope = {
            myImage: '=',
            myResultImage: '=',
            myCropStep: '=',
            myCropIndex: '='
        };
        this.template = '<canvas></canvas>';
    }

    link(scope, element, attrs) {
        let self = this;
        scope.elemWidth = $(element).parent().width();
        scope.cropPubSubObj = new CropPubSubFactory();
        scope.cropHostObj = new CropHostFactory(element, {}, scope.cropPubSubObj);

        scope.storedResultImage = null;
        scope.cropPubSubObj
            .on('image-updated', () => {
                // self.$timeout(() => {
                //     self.updateResultImage(scope);
                // });
            })
            .on('area-move area-resize', () => {
                self.$timeout(() => {
                    self.updateResultImage(scope);
                });
            })
            .on('area-move-end area-resize-end', () => {
                self.$timeout(() => {
                    self.updateResultImage(scope);
                });
            });
        scope.$watch('myImage', function () {
            scope.cropHostObj.setCanvasWidth(scope.elemWidth);
            scope.cropHostObj.setNewImageSource(scope.myImage);
        });
        scope.$watch('myCropIndex', function () {
            scope.cropHostObj.setCropStep(scope.myCropStep);
            scope.cropHostObj.resetCropAreaPm();
            if (scope.myCropStep === 1) {
                self.updateResultImage(scope);
            }
        });
    }
    updateForImageUpdate(scope) {
        let self = this;
        self.updateResultImage(scope);
    }
    updateResultImage(scope) {
        let self = this;
        let resultImage = scope.cropHostObj.getResultImageDataURI();
        scope.storedResultImage = resultImage;
        scope.myResultImage = resultImage;
    }

    static getInstance($timeout) {
        ImgCropDirective.instance = new ImgCropDirective($timeout);
        return ImgCropDirective.instance;
    }
}

ImgCropDirective.getInstance.$inject = ['$timeout'];

module.exports = ImgCropDirective;



