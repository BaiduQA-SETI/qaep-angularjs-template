/**
 * @file img-crop directive
 * @author zhangzengwei@baidu.com
 */
import CropAreaSquareFactory from './cropAreaSquare';

export default class CropHostFactory {
    constructor(elCanvas, opts, events) {
        // Object Pointers
        this.elCanvas = elCanvas;
        this.events = events;
        this.ctx = this.elCanvas[0].getContext('2d');
        this.image = null;
        this.theArea = new CropAreaSquareFactory(this.ctx, this.events);
        this.cropStep = 0;

        // Dimensions
        this.minCanvasDims = [100, 100];
        this.maxCanvasDims = [300, 300];

        // Result Image size
        // this.resImgSize = 200;
        this.resImgWidth = 10;
        this.resImgHeight = 5;

        // Result Image type
        this.resImgFormat = 'image/png';

        // Result Image quality
        this.resImgQuality = null;

        // Init Mouse Event Listeners
        $(document).on('mousemove', this.onMouseMove.bind(this));
        this.elCanvas.on('mousedown', this.onMouseDown.bind(this));
        $(document).on('mouseup', this.onMouseUp.bind(this));
    }
    setCanvasWidth(elemWidth) {
        let self = this;
        self.canvasWidth = elemWidth;
    }
    setCropStep(cropStep) {
        let self = this;
        self.cropStep = cropStep;
    }
    setNewImageSource(imageSource) {
        let self = this;
        self.image = null;
        self.resetCropHost();
        self.events.trigger('image-updated');
        if (imageSource) {
            let newImage = new Image();
            newImage.crossOrigin = 'Anonymous';
            newImage.onload = function () {
                // let temp_canvas = angular.element('<canvas></canvas>')[0];
                // let temp_ctx = temp_canvas.getContext('2d');
                // temp_canvas.width = newImage.width;
                // temp_canvas.height = newImage.height;
                // temp_ctx.drawImage(newImage, 0, 0);
                // let imgData = temp_ctx.getImageData(0, 0, temp_canvas.width, temp_canvas.height);
                // console.log(imgData);

                self.image = newImage;
                self.resetCropHost();
                self.events.trigger('image-updated');
            };
            newImage.src = imageSource;
        }
    }
    resetCropHost() {
        let self = this;
        if (self.image !== null) {
            self.theArea.setImage(self.image);
            // console.log(self.image.width, self.image.height);
            let imageDims = [self.image.width, self.image.height];
            let imageRatio = self.image.width / self.image.height;
            let canvasDims = [self.canvasWidth, self.canvasWidth / imageRatio];

            // if (canvasDims[0] > self.maxCanvasDims[0]) {
            //     canvasDims[0] = self.maxCanvasDims[0];
            //     canvasDims[1] = canvasDims[0] / imageRatio;
            // } else if (canvasDims[0] < self.minCanvasDims[0]) {
            //     canvasDims[0] = self.minCanvasDims[0];
            //     canvasDims[1] = canvasDims[0] / imageRatio;
            // }
            // if (canvasDims[1] > self.maxCanvasDims[1]) {
            //     canvasDims[1] = self.maxCanvasDims[1];
            //     canvasDims[0] = canvasDims[1] * imageRatio;
            // } else if (canvasDims[1] < self.minCanvasDims[1]) {
            //     canvasDims[1] = self.minCanvasDims[1];
            //     canvasDims[0] = canvasDims[1] * imageRatio;
            // }
            self.elCanvas.prop('width', canvasDims[0]).prop('height', canvasDims[1]);
            // self.elCanvas.prop('width', canvasDims[0]).prop('height', canvasDims[1])
            // .css({'margin-left' : -canvasDims[0] / 2 + 'px', 'margin-top' : -canvasDims[1] / 2 + 'px'});

            self.theArea.setX(self.ctx.canvas.width / 2);
            self.theArea.setY(self.ctx.canvas.height / 2);
        } else {
            self.elCanvas.prop('width', 0).prop('height', 0);
            // self.elCanvas.prop('width', 0).prop('height', 0).css({'margin-top' : 0});
        }
        self.drawScene();
    }
    resetCropAreaPm() {
        let self = this;
        if (self.image !== null) {
            let imageDims = [self.image.width, self.image.height];
            let imageRatio = self.image.width / self.image.height;
            let canvasDims = [self.canvasWidth, self.canvasWidth / imageRatio];
            self.theArea.setX(self.ctx.canvas.width / 2);
            self.theArea.setY(self.ctx.canvas.height / 2);
            self.theArea.setCropW(100);
            self.theArea.setCropH(50);
            // self.drawScene();
            // self.events.trigger('area-resize');
        }
    }
    drawScene() {
        let self = this;
        if (self.ctx) {
            self.ctx.clearRect(0, 0, self.ctx.canvas.width, self.ctx.canvas.height);
        }
        if (self.image) {
            self.ctx.drawImage(self.image, 0, 0, self.ctx.canvas.width, self.ctx.canvas.height);
            self.ctx.save();
            // and make it darker
            if (self.cropStep === 1) {
                self.ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
                self.ctx.fillRect(0, 0, self.ctx.canvas.width, self.ctx.canvas.height);
                self.theArea.draw();
            }
        }
        // self.ctx.clearRect(0, 0, self.ctx.canvas.width, self.ctx.canvas.height);
    }
    getResultImageDataURI() {
        let self = this;
        let temp_ctx, temp_canvas;
        temp_canvas = angular.element('<canvas></canvas>')[0];
        temp_ctx = temp_canvas.getContext('2d');
        if (self.image !== null) {
            let canvasImageRatio = self.ctx.canvas.width / self.image.width;
            self.resImgWidth = self.theArea.getCropW() / canvasImageRatio;
            self.resImgHeight = self.theArea.getCropH() / canvasImageRatio;
            temp_canvas.width = self.resImgWidth;
            temp_canvas.height = self.resImgHeight;
            temp_ctx.drawImage(self.image,
                (self.theArea.getX() - self.theArea.getCropW() / 2) * (self.image.width / self.ctx.canvas.width),
                (self.theArea.getY() - self.theArea.getCropH() / 2) * (self.image.height / self.ctx.canvas.height),
                self.theArea.getCropW() * (self.image.width / self.ctx.canvas.width),
                self.theArea.getCropH() * (self.image.height / self.ctx.canvas.height),
                0, 0, self.resImgWidth, self.resImgHeight);
        }
        // if (self.resImgQuality !== null) {
        //     return temp_canvas.toDataURL(self.resImgFormat, self.resImgQuality);
        // }
        return temp_canvas.toDataURL(self.resImgFormat);
    }
    onMouseMove(event) {
        let self = this;
        if(self.image !== null) {
            let offset = self.getElementOffset(self.ctx.canvas);
            let pageX = event.pageX;
            let pageY = event.pageY;
            
            self.theArea.processMouseMove(pageX - offset.left, pageY - offset.top);
            self.drawScene();
        }
    }
    onMouseDown(event) {
        let self = this;
        event.preventDefault();
        event.stopPropagation();
        if (self.image !== null) {
            let offset = self.getElementOffset(self.ctx.canvas);
            let pageX = event.pageX;
            let pageY = event.pageY;
            
            self.theArea.processMouseDown(pageX - offset.left, pageY - offset.top);
            self.drawScene();
        }
    }
    onMouseUp(event) {
        let self = this;
        if(self.image !== null) {
            let offset = self.getElementOffset(self.ctx.canvas);
            let pageX = event.pageX;
            let pageY = event.pageY;

            self.theArea.processMouseUp(pageX - offset.left, pageY - offset.top);
            self.drawScene();
        }
    }
    // Get Element's Offset
    getElementOffset(elem) {
        let box = elem.getBoundingClientRect();

        let body = document.body;
        let docElem = document.documentElement;

        let scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
        let scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

        let clientTop = docElem.clientTop || body.clientTop || 0;
        let clientLeft = docElem.clientLeft || body.clientLeft || 0;

        let top  = box.top +  scrollTop - clientTop;
        let left = box.left + scrollLeft - clientLeft;

        return {top: Math.round(top), left: Math.round(left)};
    }
}



