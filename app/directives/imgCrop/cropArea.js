/**
 * @file img-crop directive
 * @author zhangzengwei@baidu.com
 */
import CropAreaCanvasFactory from './cropCanvas';
export default class CropAreaFactory {
    constructor(ctx, events) {
        this._ctx = ctx;
	    this._events = events;

	    // this._minSize = 80;

	    this._cropCanvas = new CropAreaCanvasFactory(this._ctx);

	    this._image = new Image();
	    this._x = 0;
	    this._y = 0;
	    this._minCropW = 20;
	    this._minCropH = 20;
	    this._cropW = 100;
	    this._cropH = 50;
	    // this._size = 200;
    }
    getImage() {
    	return this._image;
    }
    setImage(image) {
	    this._image = image;
	}
	getX() {
        return this._x;
    }
    setX(x) {
        this._x = x;
        this._dontDragOutside();
    }
    getY() {
        return this._y;
    }
    setY(y) {
        this._y = y;
        this._dontDragOutside();
    }
    getCropW() {
        return this._cropW;
    }
    setCropW(width) {
        this._cropW = Math.max(this._minCropW, width);
        this._dontDragOutside();
    }
    getCropH() {
        return this._cropH;
    }
    setCropH(height) {
        this._cropH = Math.max(this._minCropH, height);
        this._dontDragOutside();
    }
    // getSize() {
    //     return this._size;
    // }
    // setSize(size) {
    //     this._size = Math.max(this._minSize, size);
    //     this._dontDragOutside();
    // }
    _dontDragOutside() {
        let h = this._ctx.canvas.height;
        let w = this._ctx.canvas.width;
        if(this._cropW > w) {
        	this._cropW = w;
        }
        if(this._cropH > h) {
        	this._cropH = h;
        }
        if(this._x < this._cropW / 2) {
        	this._x = this._cropW / 2;
        }
        if(this._x > w - this._cropW / 2) {
        	this._x = w - this._cropW / 2;
        }
        if(this._y < this._cropH / 2) {
        	this._y = this._cropH / 2;
        }
        if(this._y > h-this._cropH / 2) {
        	this._y = h - this._cropH / 2;
        }
    }
    // _dontDragOutside() {
    //     let h = this._ctx.canvas.height;
    //     let w = this._ctx.canvas.width;
    //     if(this._size > w) {
    //     	this._size = w;
    //     }
    //     if(this._size > h) {
    //     	this._size = h;
    //     }
    //     if(this._x < this._size / 2) {
    //     	this._x = this._size / 2;
    //     }
    //     if(this._x > w - this._size / 2) {
    //     	this._x = w - this._size / 2;
    //     }
    //     if(this._y < this._size / 2) {
    //     	this._y = this._size / 2;
    //     }
    //     if(this._y > h-this._size / 2) {
    //     	this._y = h - this._size / 2;
    //     }
    // }
    draw() {
    	// console.log('draw');
        // draw crop area
        this._cropCanvas.drawCropArea(this._image, [this._x, this._y], this._cropW, this._cropH, this._drawArea);
    }
    _drawArea() {}
}



