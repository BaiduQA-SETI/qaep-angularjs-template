/**
 * @file img-crop directive
 * @author zhangzengwei@baidu.com
 */
import CropAreaFactory from './cropArea';

export default class CropAreaSquareFactory extends CropAreaFactory {
    constructor(ctx, events) {
        super(ctx, events);
        this._resizeCtrlBaseRadius = 10;
        this._resizeCtrlNormalRatio = 0.5;
        this._resizeCtrlHoverRatio = 0.7;
        this._iconMoveNormalRatio = 0.9;
        this._iconMoveHoverRatio = 1.2;

        this._resizeCtrlNormalRadius = this._resizeCtrlBaseRadius * this._resizeCtrlNormalRatio;
        this._resizeCtrlHoverRadius = this._resizeCtrlBaseRadius * this._resizeCtrlHoverRatio;

        this._posDragStartX = 0;
        this._posDragStartY = 0;
        this._posResizeStartX = 0;
        this._posResizeStartY = 0;
        // this._posResizeStartSize = 0;
        this._posResizeStartWidth = 0;
        this._posResizeStartHeight = 0;

        this._resizeCtrlIsHover = -1;
        this._areaIsHover = false;
        this._resizeCtrlIsDragging = -1;
        this._areaIsDragging = false;
    }
    draw() {
    	super.draw();
        // draw move icon
        this._cropCanvas.drawIconMove([this._x, this._y],
        	this._areaIsHover ? this._iconMoveHoverRatio : this._iconMoveNormalRatio);

        // draw resize cubes
        let resizeIconsCenterCoords = this._calcSquareCorners();
	    for(let i = 0, len = resizeIconsCenterCoords.length; i < len; i++) {
	        let resizeIconCenterCoords = resizeIconsCenterCoords[i];
	        this._cropCanvas.drawIconResizeCircle(resizeIconCenterCoords,
	        	this._resizeCtrlBaseRadius, this._resizeCtrlIsHover === i
	        	? this._resizeCtrlHoverRatio : this._resizeCtrlNormalRatio);
	    }

	    // // draw resize line
	    this._cropCanvas.drawLine(this._resizeCtrlIsHover, [this._x, this._y],
	    	this._cropW, this._cropH, this._resizeCtrlNormalRadius);
    }
    _drawArea(ctx, centerCoords, cropW, cropH) {
        let halfWidth = cropW / 2;
        let halfHeight = cropH / 2;
        ctx.rect(centerCoords[0] - halfWidth, centerCoords[1] - halfHeight, cropW, cropH);
    }
    _calcSquareCorners() {
        let halfWidth = this._cropW / 2;
        let halfHeight = this._cropH / 2;
        return [
            [this._x - halfWidth, this._y - halfHeight],
            [this._x + halfWidth, this._y - halfHeight],
            [this._x - halfWidth, this._y + halfHeight],
            [this._x + halfWidth, this._y + halfHeight]
        ];
    }
    processMouseMove(mouseCurX, mouseCurY) {
    	let self = this;
	    let cursor = 'default';
	    let res = false;

	    self._resizeCtrlIsHover = -1;
	    self._areaIsHover = false;
	    if (self._areaIsDragging) {
	        self._x = mouseCurX - self._posDragStartX;
	        self._y = mouseCurY - self._posDragStartY;
	        self._areaIsHover = true;
	        cursor = 'move';
	        res = true;
	        self._events.trigger('area-move');
	    } else if (self._resizeCtrlIsDragging > -1) {
	        let xMulti, yMulti;
	        switch(self._resizeCtrlIsDragging) {
		        case 0: // Top Left
		          xMulti = -1;
		          yMulti = -1;
		          cursor = 'nwse-resize';
		          break;
		        case 1: // Top Right
		          xMulti = 1;
		          yMulti = -1;
		          cursor = 'nesw-resize';
		          break;
		        case 2: // Bottom Left
		          xMulti = -1;
		          yMulti = 1;
		          cursor = 'nesw-resize';
		          break;
		        case 3: // Bottom Right
		          xMulti = 1;
		          yMulti = 1;
		          cursor = 'nwse-resize';
		          break;
		        case 4: // Top
		          xMulti = -1;
		          yMulti = -1;
		          cursor = 'ns-resize';
		          break;
		        case 5: // Bottom
		          xMulti = 1;
		          yMulti = 1;
		          cursor = 'ns-resize';
		          break;
		        case 6: // Left
		          xMulti = -1;
		          yMulti = -1;
		          cursor = 'ew-resize';
		          break;
		        case 7: // right
		          xMulti = 1;
		          yMulti = 1;
		          cursor = 'ew-resize';
		          break;
	        }

	        let iFX = (mouseCurX - self._posResizeStartX) * xMulti;
	        let iFY = (mouseCurY - self._posResizeStartY) * yMulti;
	        if (self._resizeCtrlIsDragging === 4 || self._resizeCtrlIsDragging === 5) {
	        	iFX = 0;
	        }
	        if (self._resizeCtrlIsDragging === 6 || self._resizeCtrlIsDragging === 7) {
	        	iFY = 0;
	        }

	        self.setCropW(Math.max(self._minCropW, self._posResizeStartWidth + iFX));
	        self.setCropH(Math.max(self._minCropH, self._posResizeStartHeight + iFY));

	        self.setX(self._posStartX + (self.getCropW() - self._posResizeStartWidth) / 2 * xMulti);
	        self.setY(self._posStartY + (self.getCropH() - self._posResizeStartHeight) / 2 * yMulti);

	        self._resizeCtrlIsHover = self._resizeCtrlIsDragging;
	        res = true;
	        self._events.trigger('area-resize');
	    } else {
	        let hoveredResizeBox = self._isCoordWithinResizeCtrl([mouseCurX, mouseCurY]);
	        if (hoveredResizeBox > -1) {
		        switch (hoveredResizeBox) {
		            case 0:
		                cursor = 'nwse-resize';
		                break;
		            case 1:
			            cursor = 'nesw-resize';
			            break;
		            case 2:
			            cursor = 'nesw-resize';
			            break;
		            case 3:
			            cursor = 'nwse-resize';
			            break;
			        case 4:
			            cursor = 'ns-resize';
			            break;
			        case 5:
			            cursor = 'ns-resize';
			            break;
			        case 6:
			            cursor = 'ew-resize';
			            break;
			        case 7:
			            cursor = 'ew-resize';
			            break;
		        }
		        self._areaIsHover = false;
		        self._resizeCtrlIsHover = hoveredResizeBox;
		        res = true;
	        } else if (self._isCoordWithinArea([mouseCurX, mouseCurY])) {
		        cursor = 'move';
		        self._areaIsHover = true;
		        res = true;
	        }
	    }

	    self._dontDragOutside();
	    angular.element(self._ctx.canvas).css({'cursor': cursor});

	    return res;
    }
    processMouseDown(mouseDownX, mouseDownY) {
    	let self = this;
	    let isWithinResizeCtrl = self._isCoordWithinResizeCtrl([mouseDownX, mouseDownY]);
	    if (isWithinResizeCtrl > -1) {
	        self._areaIsDragging = false;
	        self._areaIsHover = false;
	        self._resizeCtrlIsDragging = isWithinResizeCtrl;
	        self._resizeCtrlIsHover = isWithinResizeCtrl;
	        self._posResizeStartX = mouseDownX;
	        self._posResizeStartY = mouseDownY;
	        self._posStartX = self._x;
	        self._posStartY = self._y;
	        // self._posResizeStartSize = self._size;
	        self._posResizeStartWidth = self._cropW;
	        self._posResizeStartHeight = self._cropH;
	      // self._events.trigger('area-resize-start');
	    } else if (self._isCoordWithinArea([mouseDownX, mouseDownY])) {
	        self._areaIsDragging = true;
	        self._areaIsHover = true;
	        self._resizeCtrlIsDragging = -1;
	        self._resizeCtrlIsHover = -1;
	        self._posDragStartX = mouseDownX - self._x;
	        self._posDragStartY = mouseDownY - self._y;
	        // self._events.trigger('area-move-start');
	    }
    }
    processMouseUp() {
    	let self = this;
	    if (self._areaIsDragging) {
	        self._areaIsDragging = false;
	        self._events.trigger('area-move-end');
	    }
	    if (self._resizeCtrlIsDragging > -1) {
	        self._resizeCtrlIsDragging = -1;
	        self._events.trigger('area-resize-end');
	    }
	    self._areaIsHover = false;
	    self._resizeCtrlIsHover = -1;

	    self._posDragStartX = 0;
	    self._posDragStartY = 0;
    }
    // _isCoordWithinResizeCtrl(coord) {
    //     let resizeIconsCenterCoords = this._calcSquareCorners();
    //     let res = -1;
	   //  for(let i = 0, len = resizeIconsCenterCoords.length; i < len; i++) {
	   //      let resizeIconCenterCoords = resizeIconsCenterCoords[i];
	   //      if(coord[0] > resizeIconCenterCoords[0] - this._resizeCtrlHoverRadius
	   //      	&& coord[0] < resizeIconCenterCoords[0] + this._resizeCtrlHoverRadius
	   //      	&& coord[1] > resizeIconCenterCoords[1] - this._resizeCtrlHoverRadius
	   //      	&& coord[1] < resizeIconCenterCoords[1] + this._resizeCtrlHoverRadius) {
	   //          res = i;
	   //          break;
	   //      }
	   //  }
	   //  return res;
    // }
    _isCoordWithinResizeCtrl(coord) {
        let resizeIconsCenterCoords = this._calcSquareCorners();
        let res = -1;
	    for(let i = 0, len = resizeIconsCenterCoords.length; i < len; i++) {
	        let resizeIconCenterCoords = resizeIconsCenterCoords[i];
	        if(coord[0] > resizeIconCenterCoords[0] - this._resizeCtrlHoverRadius
	        	&& coord[0] < resizeIconCenterCoords[0] + this._resizeCtrlHoverRadius
	        	&& coord[1] > resizeIconCenterCoords[1] - this._resizeCtrlHoverRadius
	        	&& coord[1] < resizeIconCenterCoords[1] + this._resizeCtrlHoverRadius) {
	            res = i;
	            break;
	        }
	    }
	    if(coord[0] > resizeIconsCenterCoords[0][0] + this._resizeCtrlHoverRadius
        	&& coord[0] < resizeIconsCenterCoords[1][0] - this._resizeCtrlHoverRadius
        	&& coord[1] > resizeIconsCenterCoords[0][1] - 2
        	&& coord[1] < resizeIconsCenterCoords[0][1] + 2) {
            res = 4;
        }
        if(coord[0] > resizeIconsCenterCoords[2][0] + this._resizeCtrlHoverRadius
        	&& coord[0] < resizeIconsCenterCoords[3][0] - this._resizeCtrlHoverRadius
        	&& coord[1] > resizeIconsCenterCoords[2][1] - 2
        	&& coord[1] < resizeIconsCenterCoords[2][1] + 2) {
            res = 5;
        }
        if(coord[1] > resizeIconsCenterCoords[0][1] + this._resizeCtrlHoverRadius
        	&& coord[1] < resizeIconsCenterCoords[2][1] - this._resizeCtrlHoverRadius
        	&& coord[0] > resizeIconsCenterCoords[0][0] - 2
        	&& coord[0] < resizeIconsCenterCoords[0][0] + 2) {
            res = 6;
        }
        if(coord[1] > resizeIconsCenterCoords[1][1] + this._resizeCtrlHoverRadius
        	&& coord[1] < resizeIconsCenterCoords[3][1] - this._resizeCtrlHoverRadius
        	&& coord[0] > resizeIconsCenterCoords[1][0] - 2
        	&& coord[0] < resizeIconsCenterCoords[1][0] + 2) {
            res = 7;
        }
	    return res;
    }
    _isCoordWithinArea(coord) {
        let squareDimensions = this._calcSquareDimensions();
        return (coord[0] >= squareDimensions.left && coord[0] <= squareDimensions.right
        	&& coord[1] >= squareDimensions.top && coord[1] <= squareDimensions.bottom);
    }
    _calcSquareDimensions() {
        let halfWidth = this._cropW / 2;
        let halfHeight = this._cropH / 2;
	    return {
	        left: this._x  - halfWidth,
	        top: this._y - halfHeight,
	        right: this._x + halfWidth,
	        bottom: this._y + halfHeight
	    };
    }
}



