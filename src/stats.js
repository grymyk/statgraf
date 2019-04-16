'use strict';

class Stats {
    constructor(props) {
        let {min = 0, max = 10, size = 100} = props;

        this.min = min;
        this.max = max;
        this.size = size;

        this.xScale = 1;
        this.yScale = 1;

        this.canvas = null;

        this.leftPadHorMark = 70;
        this.bottomPadVerMark = 20;

        this.sizeXMark = 0;
        this.sizeYMark = 0;

        this.sizeXMarkUnit = 0;
        this.sizeYMarkUnit = 0;

        this.numberXMark = 5;
        this.numberYMark = 5;

        this.init();

        this.drawHorLine = this.drawHorLine.bind(this);
        this.drawVertLine = this.drawVertLine.bind(this);
        this.drawValueLine = this.drawValueLine.bind(this);
        this.drawDispersia = this.drawDispersia.bind(this);
        this.drawLabel = this.drawLabel.bind(this);
    }

    randomDouble0to1() {
        return +Math.random();
    }

    randomDouble(size) {
        return Math.sqrt(Math.E) * this.randomDouble0to1() / size;
    }

    fixed(x, digit) {
        return +x.toFixed(digit);
    }

    randomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    randomIntMinToMax() {
        return this.randomInt(this.min, this.max);
    }

    sumOfProduct(value, prob) {
        let X_P = [];

        let len = value.length;

        for (let i = 0; i < len; i += 1) {
            let value_prob = value[i] * prob[i];

            X_P.push(value_prob);
        }

        let result = X_P.reduce((accum, current) => {
            return +accum + current;
        }, 0);

        return this.fixed(result);
    }

    average(data) {
        let {value, prob} = data;

        let avr = this.sumOfProduct(value, prob);
        let xUnit =  this.sizeXMark / this.sizeXMarkUnit;

        let nShift = value[0];

        if (nShift < 0) {
            nShift *= -1;
        }

        let x = (avr - nShift) * xUnit + this.leftPadHorMark;
        // let y = this.heightCanvas - this.bottomPadVerMark;
        let y = this.heightCanvas / 2;

        this.drawPoint(x, y);

        let text = this.fixed(avr, 0);
        this.drawLabelSaveState(text, x-8, y+15, '16px serif');

        return avr;
    }

    saveState(fn) {
        return (...args) => {
            this.ctx.save();

            fn(...args);

            this.ctx.restore();
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

    dispersion(data) {
        let {value, prob} = data;

        let avrX = this.sumOfProduct(value, prob);

        let xPow2 = value.map( (x) => {
            return Math.pow(x, 2);
        });

        let avrX2 = this.sumOfProduct(xPow2, prob);

        let sigmaX2 = avrX2 - Math.pow(avrX, 2);

        let sigma = Math.sqrt(sigmaX2);

        let xUnit =  this.sizeXMark / this.sizeXMarkUnit;

        let nShift = value[0];

        if (nShift < 0) {
            nShift *= -1;
        }

        let sigmaPX = (sigma - nShift) * xUnit + this.leftPadHorMark;
        let yAvr = this.heightCanvas / 2;

        let xAvr = (avrX - nShift) * xUnit + this.leftPadHorMark;

        // this.saveState(this.drawDispersia)(xAvr, yAvr, sigmaPX, 'blue');
        this.drawDispersiaSaveState(xAvr, yAvr, sigmaPX, 'blue');

        return sigma;
    }

    get randomData() {
        let size = this.size;
        let value = [];
        let prob = Array(size).fill(0);

        for (let i = 0; i < size; i += 1) {
            let x = this.min + i;

            value.push(x);
        }

        

        let sum = 0;
        let last = size - 1;
        let lastSum = 0;

        for (let i = 0; i < size; i += 1) {
            let p = this.randomDouble(size);

            sum += p;

            if (sum < 1) {
                prob[i] = p;
                lastSum = sum;


            } else {
                prob[last] = 1 - lastSum;

                return {
                    value, prob
                }
            }
        }

        return {
            value, prob
        }
    }

    drawPoint(x, y, style) {
        let xSize = 5;
        let ySize = 5;

        this.ctx.fillStyle = style;

        x -= xSize / 2;
        y -= ySize / 2;

        this.ctx.fillRect(x, y, xSize, ySize);
    }

    maxValue(array) {
        return array.reduce( (a, b) => Math.max(a, b));
    }

    minValue(array) {
        return array.reduce( (a, b) => Math.min(a, b));
    }

    setXScale(pixels, units) {
        this.xScale = pixels / units;
    }

    setYScale(pixels, units) {
        this.yScale = pixels / units;
    }

    drawVertMarkText(text = '', y) {
        this.ctx.fillText(text, 0, y);
    }

    drawHorMarkText(text = '', x) {
        const padBottom = this.heightCanvas + 20;
        this.ctx.fillText(text, x, padBottom);
    }

    drawVertMarkline(yStart) {
        let xStart = 45;

        let xEnd = 55;
        let yEnd = yStart;

        this.ctx.moveTo(xStart, yStart);
        this.ctx.lineTo(xEnd, yEnd);

        this.ctx.stroke();
    }

    drawHorMarkline(xStart) {
        let padBottom = 10;
        let yStart = this.heightCanvas + padBottom;

        let xEnd = xStart;
        let yEnd = yStart - 10;

        this.ctx.moveTo(xStart, yStart);
        this.ctx.lineTo(xEnd, yEnd);

        this.ctx.stroke();
    }

    setSizeYMark(size) {
        this.sizeYMark = Math.floor((this.heightCanvas) / size);
    }

    getYPosition() {
        let yMarks = [];

        this.setSizeYMark(this.numberYMark + 1);

        for (let i = 0; i <= this.numberYMark; i += 1) {
            let y = this.heightCanvas - i * this.sizeYMark - this.bottomPadVerMark;

            yMarks.push(y);
        }

        return yMarks;
    }

    setSizeXMark(size) {
        this.sizeXMark = Math.floor(this.widthCanvas / size);
    }

    getXPosition() {
        let xMarks = [];

        this.setSizeXMark(this.numberXMark);

        for (let i = 0; i <= this.numberXMark; i += 1) {
            let x = i * this.sizeXMark + this.leftPadHorMark;


            xMarks.push(x);
        }

        return xMarks;
    }

    fillYValueMarks(max) {
        let marks = [];

        this.sizeYMarkUnit = max / this.numberYMark;

        for (let i = 0; i <= max; i += this.sizeYMarkUnit) {
            marks.push(this.fixed(i, 3));
        }

        return marks;
    }

    setXLen(min, max) {
        let step = this.numberXMark - 1;
        let size = 0;

        if (min < 0 && max > 0) {
            min *= -1;

            size = (max + min) / step;
        } else {
            size = (max - min) / step;

            if (size < 0) {
                size *= -1;
            }
        }

        return this.fixed(size);
    }

    fillXValueMarks(min, max) {
        let marks = [];

        this.sizeXMarkUnit = this.setXLen(min, max);

        for (let i = min; i <= max; i += this.sizeXMarkUnit) {
            marks.push(this.fixed(i, 3));
        }

        return marks;
    }

    drawHorScaleMark(value, x) {
        let len = value.length;

        for (let i = 0; i < len; i += 1) {
            this.drawHorMarkline(x[i]);

            this.drawHorMarkText(value[i], x[i]);
        }
    }

    drawVertScaleMark(value, y) {
        let len = value.length;

        for (let i = 0; i < len; i += 1) {
            this.drawVertMarkline(y[i]);

            this.drawVertMarkText(value[i], y[i]);
        }
    }

    drawVertLine() {
        const xPad = 50;
        const yPad = 5;

        const yEnd = this.heightCanvas + yPad;

        return {
            xBegin: xPad,
            yBegin: xPad,
            xEnd: xPad,
            yEnd
        };

    }

    drawHorLine() {
        const xPad = 50;
        const yPad = 5;

        const yBegin = this.heightCanvas + yPad;
        const xEnd = this.widthCanvas + xPad;

        return {
            xBegin: xPad,
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

    drawYaxis(min, max) {
        this.drawLine('vert');
        this.drawLabelSaveState('F(x)', 47, 40, '16px serif');

        if (max > min) {
            let valueYMarks = this.fillYValueMarks(max);
            let yMarks = this.getYPosition();

            this.drawVertScaleMark(valueYMarks, yMarks);
        } else {
            console.log('max <= min');
        }
    }

    drawXaxis(min, max) {
        this.drawLine('hor');
        this.drawLabelSaveState('x', this.widthCanvas, this.heightCanvas, '16px serif');

        if (max > min) {
            let valueXMarks = this.fillXValueMarks(min, max);
            let xMarks = this.getXPosition(min, max);

            this.drawHorScaleMark(valueXMarks, xMarks);
        } else {
            console.log('max <= min');
        }
    }

    init() {
        this.canvas = document.getElementById('canvas');

        if (canvas.getContext) {
            this.ctx = canvas.getContext('2d');

            let pad = 20;

            this.widthCanvas = this.canvas.width - pad;
            this.heightCanvas = this.canvas.height - pad;
        }
    }

    clearDrawing() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    getStep(min, max, size) {

        if (min < 0 && max > 0) {
            min *= -1;

            return this.fixed((max + min) / size);
        }

        let step = (max - min) / size;

        if (step < 0) {
            step *= -1;
        }

        return this.fixed(step);
    }

    getSerieParams(serie) {
        let last = serie.length - 1;

        let min = Math.min(...serie);
        let max = Math.max(...serie);

        return {
            min,
            max,
        };
    }

    getAxisesParams(data) {
        let { value: x } = data;
        let { prob: y } = data;

        let {
            min: xMin,
            max: xMax,
            step: xStep
        } = this.getSerieParams(x);

        let {
            min: yMin,
            max: yMax,
            step: yStep
        } = this.getSerieParams(y);

        return {
            x: {
                xMin,
                xMax,
                xStep
            },
            y: {
                yMin,
                yMax,
                yStep
            }
        }
    }

    drawValueLine(x, y, style) {
        this.ctx.strokeStyle = style;
        this.ctx.beginPath();

        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x, this.heightCanvas - this.bottomPadVerMark);

        this.ctx.stroke();
    }

    drawValueLineSaveState(...args) {
        this.saveState(this.drawValueLine)(...args)
    }

    drawLabel(text, x, y, style) {
        this.ctx.font = style;

        this.ctx.fillText(text, x, y);
    }

    drawGraph(data) {
        let {value: X, prob: P} = data;

        let xUnit =  this.sizeXMark / this.sizeXMarkUnit;
        let yUnit =  this.sizeYMark / this.sizeYMarkUnit;

        let nShift = X[0];

        if (nShift < 0) {
            nShift *= -1;
        }

        P.map( (y, i) => {
            let x = (X[i] - nShift) * xUnit + this.leftPadHorMark;

            y = this.heightCanvas - this.bottomPadVerMark -  y * yUnit;

            this.drawPoint(x, y);
            this.saveState(this.drawValueLine)(x, y, 'grey');
        });
    }

    plot(data) {
        this.clearDrawing();

        const options = this.getAxisesParams(data);

        let {
            x: {xMin, xMax},
            y: {yMin, yMax}
        } = options;

        this.drawXaxis(xMin, xMax);
        this.drawYaxis(yMin, yMax);

        this.drawGraph(data);
    }
}

export {Stats};
