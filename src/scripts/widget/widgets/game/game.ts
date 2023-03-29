import {Widget} from '../widget';
import {Simulation} from '../../../simulation/simulation';

export class Game extends Widget<Simulation> {
    constructor() {
        super('div', 'game');
    }

    updateElement(state: Simulation | undefined): void {
    }
}