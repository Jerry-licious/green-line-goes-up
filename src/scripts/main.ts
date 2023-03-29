import {Simulation} from './simulation/simulation';
import {NavigationBar} from './widget/widgets/nav/navigation-bar';

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

let navigationBar = new NavigationBar();
let topBar = document.querySelector('.game .top-bar')

topBar.insertBefore(navigationBar.domElement, topBar.firstElementChild);
navigationBar.rerender();

// @ts-ignore
window["simulation"] = simulation;