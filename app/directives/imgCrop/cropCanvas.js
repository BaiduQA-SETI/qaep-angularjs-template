/**
 * @file img-crop directive
 * @author zhangzengwei@baidu.com
 */

export default class CropAreaCanvasFactory {
    constructor(ctx) {
    	this.ctx = ctx;
        this.shapeArrowNW = [[-0.5,-2],[-3,-4.5],[-0.5,-7],[-7,-7],[-7,-0.5],[-4.5,-3],[-2,-0.5]];
	    this.shapeArrowNE = [[0.5,-2],[3,-4.5],[0.5,-7],[7,-7],[7,-0.5],[4.5,-3],[2,-0.5]];
	    this.shapeArrowSW = [[-0.5,2],[-3,4.5],[-0.5,7],[-7,7],[-7,0.5],[-4.5,3],[-2,0.5]];
	    this.shapeArrowSE = [[0.5,2],[3,4.5],[0.5,7],[7,7],[7,0.5],[4.5,3],[2,0.5]];
	    this.shapeArrowN = [[-1.5,-2.5],[-1.5,-6],[-5,-6],[0,-11],[5,-6],[1.5,-6],[1.5,-2.5]];
	    this.shapeArrowW = [[-2.5,-1.5],[-6,-1.5],[-6,-5],[-11,0],[-6,5],[-6,1.5],[-2.5,1.5]];
	    this.shapeArrowS = [[-1.5,2.5],[-1.5,6],[-5,6],[0,11],[5,6],[1.5,6],[1.5,2.5]];
	    this.shapeArrowE = [[2.5,-1.5],[6,-1.5],[6,-5],[11,0],[6,5],[6,1.5],[2.5,1.5]];

		// Colors
		this.colors = {
		    areaOutline: '#fff',
		    resizeBoxStroke: '#fff',
		    resizeBoxFill: '#444',
		    resizeBoxArrowFill: '#fff',
		    resizeCircleStroke: '#fff',
		    resizeCircleFill: '#444',
		    moveIconFill: '#fff'
		};
    }
    drawCropArea(image, centerCoords, cropW, cropH, fnDrawClipPath) {
    	let self = this;
        let xRatio = image.width / self.ctx.canvas.width;
        let yRatio = image.height / self.ctx.canvas.height;
        let xLeft = centerCoords[0] - cropW / 2;
        let yTop = centerCoords[1] - cropH / 2;

        self.ctx.save();
        self.ctx.strokeStyle = self.colors.areaOutline;
        self.ctx.lineWidth = 1;
        self.ctx.beginPath();
        fnDrawClipPath(self.ctx, centerCoords, cropW, cropH);
        self.ctx.stroke();
        self.ctx.clip();
        // console.log(xLeft, xRatio, yTop, yRatio, cropW, cropH);
        // draw part of original image
        if (cropW > 0 && cropH > 0) {
            self.ctx.drawImage(image, xLeft * xRatio, yTop * yRatio,
            	cropW * xRatio, cropH * yRatio, xLeft, yTop, cropW, cropH);
        }

        self.ctx.beginPath();
        fnDrawClipPath(self.ctx, centerCoords, cropW, cropH);
        self.ctx.stroke();
        self.ctx.clip();

        self.ctx.restore();
    }
    drawIconMove(centerCoords, scale) {
    	let self = this;
        self.drawFilledPolygon(self.shapeArrowN, self.colors.moveIconFill, centerCoords, scale);
        self.drawFilledPolygon(self.shapeArrowW, self.colors.moveIconFill, centerCoords, scale);
        self.drawFilledPolygon(self.shapeArrowS, self.colors.moveIconFill, centerCoords, scale);
        self.drawFilledPolygon(self.shapeArrowE, self.colors.moveIconFill, centerCoords, scale);
    }
    // Draw Filled Polygon
    drawFilledPolygon(shape, fillStyle, centerCoords, scale) {
    	let self = this;
        self.ctx.save();
        self.ctx.fillStyle = fillStyle;
        self.ctx.beginPath();
        let pc;
        let pc0 = self.calcPoint(shape[0], centerCoords, scale);
        self.ctx.moveTo(pc0[0], pc0[1]);

        for(let p in shape) {
            if (p > 0) {
                pc = self.calcPoint(shape[p], centerCoords, scale);
                self.ctx.lineTo(pc[0], pc[1]);
            }
        }

        self.ctx.lineTo(pc0[0], pc0[1]);
        self.ctx.fill();
        self.ctx.closePath();
        self.ctx.restore();
    }
    // Calculate Point
    calcPoint(point, offset, scale) {
        return [scale * point[0] + offset[0], scale * point[1] + offset[1]];
    }
    drawIconResizeCircle(centerCoords, circleRadius, scale) {
    	let self = this;
        let scaledCircleRadius = circleRadius * scale;
        self.ctx.save();
        self.ctx.strokeStyle = self.colors.resizeCircleStroke;
        self.ctx.lineWidth = 1.5;
        self.ctx.fillStyle = self.colors.resizeCircleFill;
        self.ctx.beginPath();
        self.ctx.arc(centerCoords[0], centerCoords[1], scaledCircleRadius, 0 , 2 * Math.PI);
        self.ctx.fill();
        self.ctx.stroke();
        self.ctx.closePath();
        self.ctx.restore();
    }
    drawLine(type, centerCoords, cropW, cropH, resizeCtrlNormalRadius) {
    	let self = this;
    	self.ctx.save();
        self.ctx.strokeStyle = self.colors.resizeCircleStroke;
        self.ctx.lineWidth = 2;
        self.ctx.fillStyle = self.colors.resizeCircleFill;
        self.ctx.beginPath();
        let xStart, yStart, xEnd, yEnd;
        let halfWidth = cropW / 2;
        let halfHeight = cropH / 2;
        if (type === 4) {
        	xStart = centerCoords[0] - halfWidth + resizeCtrlNormalRadius;
        	yStart = centerCoords[1] - halfHeight;
        	xEnd = centerCoords[0] + halfWidth - resizeCtrlNormalRadius;
        	yEnd = centerCoords[1] - halfHeight;
        }
        if (type === 5) {
        	xStart = centerCoords[0] - halfWidth + resizeCtrlNormalRadius;
        	yStart = centerCoords[1] + halfHeight;
        	xEnd = centerCoords[0] + halfWidth - resizeCtrlNormalRadius;
        	yEnd = centerCoords[1] + halfHeight;
        }
        if (type === 6) {
        	xStart = centerCoords[0] - halfWidth;
        	yStart = centerCoords[1] - halfHeight + resizeCtrlNormalRadius;
        	xEnd = centerCoords[0] - halfWidth;
        	yEnd = centerCoords[1] + halfHeight - resizeCtrlNormalRadius;
        }
        if (type === 7) {
        	xStart = centerCoords[0] + halfWidth;
        	yStart = centerCoords[1] - halfHeight + resizeCtrlNormalRadius;
        	xEnd = centerCoords[0] + halfWidth;
        	yEnd = centerCoords[1] + halfHeight - resizeCtrlNormalRadius;
        }
        self.ctx.moveTo(xStart, yStart);
        self.ctx.lineTo(xEnd, yEnd);
        self.ctx.fill();
        self.ctx.stroke();
        self.ctx.closePath();
        self.ctx.restore();
    }
}



