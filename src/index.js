import './css/main.scss';

import handleClick from './js/handleClick.js'

let size = 50;

function inputHandler(event) {
    const numberN = +event.target.value;

    output.innerHTML = numberN;
    size = numberN;

    handleClick(size);
}

const sizer = document.getElementById('sizer');
const output = sizer.getElementsByTagName('output')[0];

sizer.addEventListener('input', inputHandler);

window.onload = () => handleClick(size);

handleClick(size);
