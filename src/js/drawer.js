class Drawer {
    constructor(props) {
        const { element, height, width } = props;

        this.canvas = element;

        if (canvas.getContext) {
            this.ctx = canvas.getContext('2d');

            this.widthCanvas = width;
            this.heightCanvas = height;

            this.xOrigin = 35;
            this.yOrigin = 15;
            this.bottomPadVerMark = 30;
        }
    }

    drawHorlineDisp(xAvr, yAvr, sigmaPX, style) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = style;

        const xBegin = xAvr - sigmaPX;
        const yBegin = yAvr;
        const xEnd = xAvr + sigmaPX;
        const yEnd = yAvr;

        this.ctx.moveTo(xBegin, yBegin);
        this.ctx.lineTo(xEnd, yEnd);

        this.ctx.stroke();
    }

    drawVertMark(x, y) {
        const size = 10;

        this.ctx.moveTo(x, y - size);
        this.ctx.lineTo(x, y + size);
    }

    drawVertMarks(xAvr, yAvr, sigmaPX, style) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = style;

        const xRight = xAvr + sigmaPX;
        const xLeft = xAvr - sigmaPX;

        this.drawVertMark(xRight, yAvr);
        this.drawVertMark(xLeft, yAvr);

        this.ctx.stroke();
    }

    drawDispersia = (xAvr, yAvr, sigmaPX, style) => {
        this.drawHorlineDisp(xAvr, yAvr, sigmaPX, style);

        this.drawVertMarks(xAvr, yAvr, sigmaPX, style)
    };

    drawDispersiaSaveState(...args) {
        this.saveState(this.drawDispersia)(...args)
    }

    drawValueLine = (x, y, style) => {
        this.ctx.strokeStyle = style;
        this.ctx.beginPath();

        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x, this.heightCanvas - this.bottomPadVerMark);

        this.ctx.stroke();
    };

    drawValueRect = (x, y, style, number) => {
        this.ctx.fillStyle = style;
        const total_width = 100;

        const width = (total_width / number).toFixed(0);

        const height = this.heightCanvas - y;

        x -= width / 2;

        this.ctx.fillRect(x, y, width, height);
    };

    drawValueRectSaveState(...args) {
        this.saveState(this.drawValueRect)(...args)
    }

    drawValueLineSaveState(...args) {
        this.saveState(this.drawValueLine)(...args)
    }

    drawPointSaveState(...args) {
        this.saveState(this.drawPoint)(...args)
    }

    drawPoint = (x, y, style) => {
        const xSize = 5;
        const ySize = 5;

        this.ctx.fillStyle = style;

        x -= xSize / 2;
        y -= ySize / 2;

        this.ctx.fillRect(x, y, xSize, ySize);
    };

    drawVertMarkText(text = '', y) {
        this.ctx.fillText(text, 1, y+4);
    }

    drawVertMarkline(yStart) {
        const xStart = 30;

        const xEnd = xStart + 10;
        const yEnd = yStart;

        this.ctx.moveTo(xStart, yStart);
        this.ctx.lineTo(xEnd, yEnd);

        this.ctx.stroke();
    }

    drawVertScaleMark(value, y) {
        const len = value.length;

        for (let i = 0; i < len; i += 1) {
            this.drawVertMarkline(y[i]);

            this.drawVertMarkText(value[i], y[i]);
        }
    }

    drawHorMarkline(xStart) {
        const yStart = this.heightCanvas - 10;

        const xEnd = xStart;
        const yEnd = yStart - 10;

        this.ctx.moveTo(xStart, yStart);
        this.ctx.lineTo(xEnd, yEnd);

        this.ctx.stroke();
    }

    drawHorMarkText(text = '', x) {
        const padBottom = this.heightCanvas;
        this.ctx.fillText(text, x-2, padBottom);
    }

    drawHorScaleMark(value, x) {
        const len = value.length;

        for (let i = 0; i < len; i += 1) {
            this.drawHorMarkline(x[i]);

            this.drawHorMarkText(value[i], x[i]);
        }
    }

    drawLabel = (text, x, y, style) => {
        y = this.heightCanvas - y;

        this.ctx.font = style;
        this.ctx.fillText(text, x, y);
    };

    clearDrawing() {
        const { width, height } = this.canvas;

        this.ctx.clearRect(0, 0, width, height);
    }

    drawVertLine = () => {
        const yEnd = this.heightCanvas - this.yOrigin;
        const xPad = this.xOrigin;

        return {
            xBegin: xPad,
            yBegin: 30,
            xEnd: xPad,
            yEnd
        };
    };

    drawHorLine = () => {
        const xEnd = this.widthCanvas;
        const yBegin = this.heightCanvas - this.yOrigin;

        return {
            xBegin: this.xOrigin,
            yBegin,
            xEnd,
            yEnd: yBegin
        };
    };

    drawLine(type) {
        this.ctx.beginPath();

        const lineType = {
            vert: this.drawVertLine,
            hor: this.drawHorLine
        };

        const option = lineType[type]();

        const { xBegin, yBegin, xEnd, yEnd } = option;

        this.ctx.moveTo(xBegin, yBegin);
        this.ctx.lineTo(xEnd, yEnd);

        this.ctx.stroke();
    }

    drawLabelSaveState(...args) {
        this.saveState(this.drawLabel)(...args)
    }

    saveState(fn) {
        return (...args) => {
            this.ctx.save();

            fn(...args);

            this.ctx.restore();
        }
    }
}

export default Drawer;
