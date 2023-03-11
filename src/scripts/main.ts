import {Actor} from './simulation/actor';
import {Good} from './simulation/good';
import {Simulation} from './simulation/simulation';

let simulation = new Simulation();
console.log(simulation);

for (let i = 0; i < 1000; i++) {
    simulation.tick();
    console.log(Array.from(simulation.markets.values()).map((market) => market.currentExchangePrice).join(", "));
}
console.log(simulation);