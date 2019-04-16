'use strict';

import {Stats} from "./stats";

import './stats.scss';

const config = {
    min: 0,
    // max: 10,
    size: 101
};

const stats = new Stats(config);

/*let x = [2, 4, 6, 8, 10];
let p = [0.25, 0.125, 0.25, 0.125, 0.25];

let data = {
    value: x,
    prob: p
};*/

function handlerClick() {
    let data = stats.randomData;

    stats.plot(data);
    stats.average(data);
    stats.dispersion(data);
}

const btn = document.getElementById('plot');

btn.addEventListener('click', handlerClick);

window.onload = () => {
    handlerClick();
};
//btn.style.display = 'none';
//handlerClick();