import {Simulation} from './simulation/simulation';
import {Game} from './widget/widgets/game/game';
import {FirmBlueprint} from './simulation/templates/firm-blueprint';
import {FirmWidget} from './widget/widgets/game/firms/firm-widget';

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

let game = new Game();
document.body.append(game.domElement);

// @ts-ignore
window["simulation"] = simulation;