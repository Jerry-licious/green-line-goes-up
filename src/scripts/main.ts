import {Simulation} from './simulation/simulation';
import {Game} from './widget/widgets/game/game';

let simulation = new Simulation();
console.log(simulation);

/*
for (let i = 0; i < 200; i++) {
    simulation.tick();
    console.log(Array.from(simulation.markets.values())
        .map((market) => `${market.good}=${market.currentExchangePrice}`).join(", "));
}
console.log(simulation);
*/

let navigationBar = new Game();
document.body.append(navigationBar.domElement);

// @ts-ignore
window["simulation"] = simulation;