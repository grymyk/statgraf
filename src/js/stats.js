import Drawer from "./drawer.js";
import '../css/stats.scss';

class Stats {
    constructor(props) {
        const { min = 0, max = 10 } = props;

        this.min = min;
        this.max = max;

        this.xScale = 1;
        this.yScale = 1;

        this.heightCanvas = 0;
        this.widthCanvas = 0;

        this.bottomPadVerMark = 30;
        this.leftPadHorMark = 50;
        this.topPad = 70;

        this.sizeXMark = 0;
        this.sizeYMark = 0;

        this.sizeXMarkUnit = 1;
        this.sizeYMarkUnit = 1;

        this.numberXMark = 6;
        this.numberYMark = 5;

        this.init();
    }

    init() {
        const canvas = document.getElementById('canvas');

        const { height, width } = canvas;

        const xPad = 30;

        this.widthCanvas = width - xPad;
        this.heightCanvas = height;

        const props = {
            element: canvas,
            width: this.widthCanvas,
            height: this.heightCanvas,
        };

        this.drawer = new Drawer(props);
    }

    randomDouble0to1 = () => +Math.random();

    randomDouble = (size) => {
        return Math.sqrt(Math.E) * this.randomDouble0to1() / size
    }

    fixed = (x, digit) => +x.toFixed(digit);

    randomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    randomIntMinToMax = () => this.randomInt(this.min, this.max);

    sumOfProduct(value, prob) {
        const X_P = [];
        const len = value.length;

        for (let i = 0; i < len; i += 1) {
            const value_prob = value[i] * prob[i];

            X_P.push(value_prob);
        }

        const result = X_P.reduce( (accum, current) => {
            return +accum + current;
        }, 0);

        return this.fixed(result);
    };

    getTextXPosition(text) {
        const base = 10;
        let digit = 2;

        const size = Math.floor(text / base);

        if (size === 0) {
            digit = 1;
        }

        return digit;
    }

    maxValue = (array) => array.reduce( (a, b) => Math.max(a, b) );

    minValue = (array) => array.reduce( (a, b) => Math.min(a, b) );

    setXScale(pixels, units) {
        this.xScale = pixels / units;
    }

    setYScale(pixels, units) {
        this.yScale = pixels / units;
    }

    setSizeYMark(size) {
        this.sizeYMark = Math.floor( (this.heightCanvas - this.topPad) / size);
    }

    getYPosition() {
        const yMarks = [];

        this.setSizeYMark(this.numberYMark);

        for (let i = 0; i <= this.numberYMark; i += 1) {
            const y = this.heightCanvas - i * this.sizeYMark - this.bottomPadVerMark;

            yMarks.push(y);
        }

        return yMarks;
    }

    setSizeXMark(size) {
        this.sizeXMark = Math.floor(this.widthCanvas / size);
    }

    getXPosition() {
        const xMarks = [];

        this.setSizeXMark(this.numberXMark);

        for (let i = 0; i < this.numberXMark; i += 1) {
            const x = i * this.sizeXMark + this.leftPadHorMark;

            xMarks.push(x);
        }

        return xMarks;
    }

    fillYValueMarks(max) {
        const marks = [];
        const period = 3;

        this.sizeYMarkUnit = max / this.numberYMark;

        for (let i = 0; i <= max; i += this.sizeYMarkUnit) {
            marks.push( this.fixed(i, period) );
        }

        return marks;
    }

    setXLen(min, max) {
        const step = this.numberXMark - 1;
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
        const marks = [];
        const period =  3;

        this.sizeXMarkUnit = this.setXLen(min, max);

        const len = this.numberXMark;
        let x = min;

        for (let i = 0; i < len; i += 1) {
            x = i * this.sizeXMarkUnit;

            marks.push( this.fixed(x, period) );
        }

        return marks;
    }

    drawYaxis(min, max) {
        const title = 'F(x)';
        const y = 0;
        const height = this.heightCanvas - 15;
        const fontStyle = '16px serif';

        this.drawer.drawLine('vert');
        this.drawer.drawLabelSaveState(title, y, height, fontStyle);

        if (max >= min) {
            const valueYMarks = this.fillYValueMarks(max);
            const yMarks = this.getYPosition();

            this.drawer.drawVertScaleMark(valueYMarks, yMarks);
        } else {
            console.log('max < min');
        }
    }

    drawXaxis(min, max) {
        const title = 'x';
        const y = 380;
        const height = 0;
        const fontStyle = '16px serif';

        this.drawer.drawLine('hor');
        this.drawer.drawLabelSaveState(title, y, height, fontStyle);

        if (max >= min) {
            const valueXMarks = this.fillXValueMarks(min, max);
            const xMarks = this.getXPosition(min, max);

            this.drawer.drawHorScaleMark(valueXMarks, xMarks);
        } else {
            console.log('max < min');
        }
    }

    getStep(min, max, size) {

        if (min < 0 && max > 0) {
            min *= -1;

            return this.fixed( (max + min) / size);
        }

        let step = (max - min) / size;

        if (step < 0) {
            step *= -1;
        }

        return this.fixed(step);
    }

    getSerieParams(serie) {
        const min = Math.min(...serie);
        const max = Math.max(...serie);

        return {min, max};
    }

    getAxisesParams(data) {
        const { value: x } = data;
        const { prob: y } = data;

        const {
            min: xMin,
            max: xMax
        } = this.getSerieParams(x);

        const {
            min: yMin,
            max: yMax
        } = this.getSerieParams(y);

        return {
            x: {
                xMin,
                xMax
            },
            y: {
                yMin,
                yMax
            }
        }
    }

    average(data) {
        const { value, prob } = data;

        if (value === undefined && prob === undefined) {
            return undefined;
        }

        const avr = this.sumOfProduct(value, prob);
        const xUnit =  this.sizeXMark / this.sizeXMarkUnit;

        let nShift = value[0];

        if (nShift < 0) {
            nShift *= -1;
        }

        let x = (avr - nShift) * xUnit + this.leftPadHorMark;
        // let y = this.heightCanvas - this.bottomPadVerMark;
        let y = this.heightCanvas / 2;

        console.log(x, y)

        // this.drawer.drawPoint(x, y, 'blue');
        this.drawer.drawPointSaveState(x, y, 'blue');

        const period = 0;
        const text = this.fixed(avr, period);
        const height = y+7;
        const shift = 4;
        const fontStyle = '16px serif';

        x -= this.getTextXPosition(text) * shift;

        this.drawer.drawLabelSaveState(text, x, height, fontStyle);

        return avr;
    }

    dispersion(data) {
        const { value, prob } = data;

        if (value === undefined && prob === undefined) {
            return undefined;
        }

        const avrX = this.sumOfProduct(value, prob);

        const xPow2 = value.map( (x) => {
            return Math.pow(x, 2);
        });

        const avrX2 = this.sumOfProduct(xPow2, prob);

        const sigmaX2 = avrX2 - Math.pow(avrX, 2);

        const sigma = Math.sqrt(sigmaX2);

        const xUnit =  this.sizeXMark / this.sizeXMarkUnit;

        let nShift = value[0];

        if (nShift < 0) {
            nShift *= -1;
        }

        const sigmaPX = (sigma - nShift) * xUnit + this.leftPadHorMark;
        const yAvr = this.heightCanvas / 2;

        const xAvr = (avrX - nShift) * xUnit + this.leftPadHorMark;

        // this.saveState(this.drawDispersia)(xAvr, yAvr, sigmaPX, 'blue');
        // this.drawer.drawDispersiaSaveState(xAvr, yAvr, sigmaPX, 'blue');
        this.drawer.drawDispersia(xAvr, yAvr, sigmaPX);

        return sigma;
    }

    dist_fn = {
        poisson: (params, size) => {
            const { success, lambda } = params;

            if (lambda > 0 && success >= 0) {

                const prob = [];
                const value = [];

                for (let s = 0, n = 0; n < size; n += 1) {
                    prob[s] = this.poisson(s, lambda);
                    value[s] = s;

                    s += 1
                }

                return { prob, value }
            } else {
                console.log('lambda < 0 || k < 0');
            }
        },

        linear: (params, size) => {
            let { k, b } = params;

            if (b === 0) {
                b = 1;
            }

            const prob = [];
            const value = [];

            for (let i = 0; i < size; i += 1) {
                value[i] = i;
                prob[i] = k * i + b
            }

            return { prob, value }
        },

        polynomial: (params, size) => {
            const { koef, degree } = params;

            if (koef && degree) {
                const prob = [];
                const value = [];

                for (let x = 0; x < size; x += 1) {
                    value[x] = x;
                    prob[x] = koef * Math.pow(x, degree);
                }

                return { prob, value }
            } else {
                console.log('params are fail')
            }
        },

        random: (size) => {
            const value = [];
            const prob = Array(size).fill(0);

            for (let i = 0; i < size; i += 1) {
                const x = this.min + i;

                value.push(x);
            }

            let sum = 0;
            let last = size - 1;
            let lastSum = 0;

            for (let i = 0; i < size; i += 1) {
                const p = this.randomDouble(size);

                sum += p;

                if (sum < 1) {
                    prob[i] = p;
                    lastSum = sum;
                } else {
                    prob[last] = 1 - lastSum;

                    return {
                        prob, value
                    }
                }
            }

            return { prob, value }
        },
    };

    getData(type, params, size) {
        this.dist_fn[type](params, size);
    }

    randomData(size) {
        const value = [];
        const prob = Array(size).fill(0);

        for (let i = 0; i < size; i += 1) {
            const x = this.min + i;

            value.push(x);
        }

        let sum = 0;
        let last = size - 1;
        let lastSum = 0;

        for (let i = 0; i < size; i += 1) {
            const p = this.randomDouble(size);

            sum += p;

            if (sum < 1) {
                prob[i] = p;
                lastSum = sum;
            } else {
                prob[last] = 1 - lastSum;

                return {
                    prob, value
                }
            }
        }

        return { prob, value }
    }

    factorial = (x) => (x === 0) ? 1 : x * this.factorial(x - 1);

    poisson(success, lambda) {
        const exponentialPower = Math.pow(Math.E, -lambda);
        const lambdaPower = Math.pow(lambda, success);

        const numerator = exponentialPower * lambdaPower;
        const denominator = this.factorial(success);
        const period = 5;

        return this.fixed(numerator / denominator, period);
    }

    poissonData(params, size) {
        const { success, lambda } = params;

        if (lambda > 0 && success >= 0) {

            const prob = [];
            const value = [];

            for (let s = 0, n = 0; n < size; n += 1) {
                prob[s] = this.poisson(s, lambda);
                value[s] = s;

                s += 1
            }

            return { prob, value }
        } else {
            console.log('lambda < 0 || k < 0');
        }
    }

    polynomData(params, size) {
        const { koef, degree } = params;

        if (koef && degree) {
            const prob = [];
            const value = [];

            for (let x = 0; x < size; x += 1) {
                value[x] = x;
                prob[x] = koef * Math.pow(x, degree);
            }

            return { prob, value }
        } else {
            console.log('params are fail')
        }
    }

    linearData(params, size) {
        let { k, b } = params;

        if (b === 0) {
            b = 1;
        }

        const prob = [];
        const value = [];

        for (let i = 0; i < size; i += 1) {
            value[i] = i;
            prob[i] = k * i + b
        }

        return { prob, value }
    }

    drawGraph(data) {
        const {
            value: X,
            prob: P
        } = data;

        let maxProb = Math.max(...P);

        if (maxProb === 0) {
            maxProb = 1;
        }

        const xUnit =  Math.floor(this.sizeXMark / this.sizeXMarkUnit);

        //const yUnit =  Math.floor(this.sizeYMark / this.sizeYMarkUnit);
        const yUnit = (this.heightCanvas - this.topPad) / maxProb;

        let nShift = X[0];

        if (nShift < 0) {
            nShift *= -1;
        }

        const number = X.length;

        P.map( (y, i) => {
            const x = (X[i] - nShift) * xUnit + this.leftPadHorMark;

            // y = this.heightCanvas - this.bottomPadVerMark -  y * yUnit;
            y = this.heightCanvas  - this.bottomPadVerMark - y * yUnit;

            this.drawer.drawPoint(x, y, number);
            this.drawer.drawValueLineSaveState(x, y, 'grey');
            // this.drawer.drawValueRectSaveState(x, y, 'grey', number);

            //this.drawer.drawLabelSaveState(x, x, y, '16px serif');
        });
    }

    drawAxises(data) {
        if (data) {
            this.drawer.clearDrawing();

            const options = this.getAxisesParams(data);

            const {
                x: { xMin, xMax },
                y: { yMin, yMax }
            } = options;

            this.drawXaxis(xMin, xMax);
            this.drawYaxis(yMin, yMax);
        } else {
            console.log('No Data')
        }
    }

    plot(data) {
        const { value, prob } = data;

        if (value === undefined && prob === undefined) {
            return undefined;
        }

        this.drawAxises(data);
        this.drawGraph(data);
    }
}

export { Stats };
