import {Widget} from '../widget';
import {Simulation} from '../../../simulation/simulation';
import {TopBar} from './topbar/top-bar';
import {Div} from '../../builders/common-elements';

export class Game extends Widget<Simulation> {
    topBar = new TopBar(this);
    display = new Div({styleClasses: ['display']}).build();

    constructor() {
        super('div', 'game');

        this.domElement.append(
            this.topBar.domElement,
            this.display
        );
    }

    // Removes everything in the display section.
    clearDisplay() {
        while (this.display.hasChildNodes()) {
            this.display.removeChild(this.display.firstChild);
        }
    }

    // Updates what's in the display section based on the navigation bar.
    updateSelection(selection: number) {
        this.clearDisplay();
        switch (selection) {
            case 0:
                this.display.append("Overview")
                return;
            case 1:
                this.display.append("Population")
                return;
            case 2:
                this.display.append("Markets")
                return;
            case 3:
                this.display.append("Resources")
                return;
            case 4:
                this.display.append("Factories")
                return;
            case 5:
                this.display.append("Technology")
                return;
        }
    }

    updateElement(state: Simulation | undefined): void {
    }
}