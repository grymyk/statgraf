class Drawer {
    constructor(props) {
        this.canvas = props.element;

        if (canvas.getContext) {
            this.ctx = canvas.getContext('2d');

            this.widthCanvas = props.width;
            this.heightCanvas = props.height;

            this.drawHorLine = this.drawHorLine.bind(this);
            this.drawVertLine = this.drawVertLine.bind(this);

            this.drawLabel = this.drawLabel.bind(this);
            this.drawPoint = this.drawPoint.bind(this);
            this.drawValueLine = this.drawValueLine.bind(this);
            this.drawDispersia = this.drawDispersia.bind(this);
            this.drawValueRect = this.drawValueRect.bind(this);
        }
    }

    drawHorlineDisp(xAvr, yAvr, sigmaPX, style) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = style;

        let xBegin = xAvr - sigmaPX;
        let yBegin = yAvr;
        let xEnd = xAvr + sigmaPX;
        let yEnd = yAvr;

        this.ctx.moveTo(xBegin, yBegin);
        this.ctx.lineTo(xEnd, yEnd);

        this.ctx.stroke();
    }

    drawVertMark(x, y) {
        let size = 10;

        this.ctx.moveTo(x, y - size);
        this.ctx.lineTo(x, y + size);
    }

    drawVertMarks(xAvr, yAvr, sigmaPX, style) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = style;

        let xRight = xAvr + sigmaPX;
        let xLeft = xAvr - sigmaPX;

        this.drawVertMark(xRight, yAvr);
        this.drawVertMark(xLeft, yAvr);

        this.ctx.stroke();
    }

    drawDispersia(xAvr, yAvr, sigmaPX, style) {
        this.drawHorlineDisp(xAvr, yAvr, sigmaPX, style);

        this.drawVertMarks(xAvr, yAvr, sigmaPX, style)
    }

    drawDispersiaSaveState(...args) {
        this.saveState(this.drawDispersia)(...args)
    }

    drawValueLine(x, y, style) {
        this.ctx.strokeStyle = style;
        this.ctx.beginPath();

        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x, this.heightCanvas);

        this.ctx.stroke();
    }

    drawValueRect(x, y, style, number) {
        this.ctx.fillStyle = style;
        const total_width = 100;

        let width = (total_width / number).toFixed(0);

        let height = this.heightCanvas - y;

        x -= width / 2;

        this.ctx.fillRect(x, y, width, height);
    }

    drawValueRectSaveState(...args) {
        this.saveState(this.drawValueRect)(...args)
    }

    drawValueLineSaveState(...args) {
        this.saveState(this.drawValueLine)(...args)
    }

    drawPointSaveState(...args) {
        this.saveState(this.drawPoint)(...args)
    }

    drawPoint(x, y, style) {
        let xSize = 5;
        let ySize = 5;

        this.ctx.fillStyle = style;

        x -= xSize / 2;
        y -= ySize / 2;

        this.ctx.fillRect(x, y, xSize, ySize);
    }

    drawVertMarkText(text = '', y) {
        this.ctx.fillText(text, 1, y+4);
    }

    drawVertMarkline(yStart) {
        let xStart = 30;

        let xEnd = xStart + 10;
        let yEnd = yStart;

        this.ctx.moveTo(xStart, yStart);
        this.ctx.lineTo(xEnd, yEnd);

        this.ctx.stroke();
    }

    drawVertScaleMark(value, y) {
        let len = value.length;

        for (let i = 0; i < len; i += 1) {
            this.drawVertMarkline(y[i]);

            this.drawVertMarkText(value[i], y[i]);
        }
    }

    drawHorMarkline(xStart) {
        let yStart = this.heightCanvas + 18;

        let xEnd = xStart;
        let yEnd = yStart - 10;

        this.ctx.moveTo(xStart, yStart);
        this.ctx.lineTo(xEnd, yEnd);

        this.ctx.stroke();
    }

    drawHorMarkText(text = '', x) {
        const padBottom = this.heightCanvas + 28;
        this.ctx.fillText(text, x-2, padBottom);
    }

    drawHorScaleMark(value, x) {
        let len = value.length;

        for (let i = 0; i < len; i += 1) {
            this.drawHorMarkline(x[i]);

            this.drawHorMarkText(value[i], x[i]);
        }
    }

    drawLabel(text, x, y, style) {
        y = this.heightCanvas - y;

        this.ctx.font = style;
        this.ctx.fillText(text, x, y);
    }

    clearDrawing() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawVertLine() {
        const yEnd = this.heightCanvas + 14;
        const xPad = 35;

        return {
            xBegin: xPad,
            yBegin: 50,
            xEnd: xPad,
            yEnd
        };
    }

    drawHorLine() {
        const xEnd = this.widthCanvas;
        const yBegin = this.heightCanvas + 13;

        return {
            xBegin: 35,
            yBegin,
            xEnd,
            yEnd: yBegin
        };
    }

    drawLine(type) {
        this.ctx.beginPath();

        const lineType = {
            vert: this.drawVertLine,
            hor: this.drawHorLine
        };

        let option = lineType[type]();

        let {xBegin, yBegin, xEnd, yEnd} = option;

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

export {Drawer};
