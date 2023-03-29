import {Simulation} from './simulation/simulation';

let simulation = new Simulation();
console.log(simulation);


for (let i = 0; i < 200; i++) {
    simulation.tick();
    console.log(Array.from(simulation.markets.values())
        .map((market) => `${market.good}=${market.currentExchangePrice}`).join(", "));
}
console.log(simulation);

// @ts-ignore
window["simulation"] = simulation;