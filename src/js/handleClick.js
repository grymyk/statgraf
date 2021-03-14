import { Stats } from "./stats.js";

import dists from './dists.json';

const config = {
    min: 0,
    // max: 10
};

let size = 50;

const stats = new Stats(config);

const handleClick = (size) => {
    // DOES NOT WORK
    //data = stats.poissonData(poissonParams, size);

    // DOES NOT WORK
    //data = stats.getData('poisson', dists['poisson'], size);

    // DOES NOT WORK
    //data = stats.getData('linear', dists['linear'], size);

    // DOES NOT WORK
    //data = stats.polynomData('polynomial', dists['polynomial'], size);

    let data = {};

    //data = stats.randomData(size);

    data = {
        prob: [1, 4, 9, 16, 25],
        value: [1, 2, 3, 4, 5]
    };

    //stats.average(data);
    //stats.dispersion(data);

    console.log(data);

    stats.plot(data);
}

export default handleClick;
