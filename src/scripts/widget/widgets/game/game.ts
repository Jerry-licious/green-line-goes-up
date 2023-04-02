import {Widget} from '../widget';
import {Simulation} from '../../../simulation/simulation';
import {TopBar} from './topbar/top-bar';
import {Div} from '../../builders/common-elements';
import {FirmsContainer} from './firms/firms-container';
import {PopulationWidget} from './population/population';
import {MarketsWidget} from './markets/markets-widget';

export class Game extends Widget<null> {
    simulation = new Simulation();

    topBar = new TopBar(this);
    display = new Div({styleClasses: ['display']}).build();

    resources = new FirmsContainer(this, this.simulation.resources, false);
    population = new PopulationWidget(this);
    markets = new MarketsWidget(this);

    timeSinceLastUpdate = 0.0;
    updateInterval = 0.0;

    constructor() {
        super('div', 'game');

        this.domElement.append(
            this.topBar.domElement,
            this.display
        );

        this.tick();

        window.requestAnimationFrame((t) => this.update(t));
    }

    previousTime: number = 0;

    update(currentTime: number) {
        // Only update the simulation when the game isn't paused.
        if (this.updateInterval != 0) {
            let deltaT = currentTime - this.previousTime;

            this.timeSinceLastUpdate += deltaT;

            if (this.timeSinceLastUpdate >= this.updateInterval) {
                this.tick();

                this.timeSinceLastUpdate = 0;
            }
        }

        this.previousTime = currentTime;

        window.requestAnimationFrame((t) => this.update(t));
    }

    tick() {
        this.simulation.tick();

        this.topBar.gameTick();
        this.resources.gameTick();
        this.population.gameTick();
        this.markets.gameTick();
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
                this.display.append("Overview");
                return;
            case 1:
                this.display.append(this.population.domElement);
                return;
            case 2:
                this.display.append(this.markets.domElement);
                return;
            case 3:
                this.display.append(this.resources.domElement);
                return;
            case 4:
                this.display.append("Factories");
                return;
            case 5:
                this.display.append("Technology");
                return;
        }
    }
    
    updateTimeControl(speed: number) {
        switch (speed) {
            // Pause
            case 0:
                this.updateInterval = 0;
                break;
            // Base speed, two cycles per second.
            case 1:
                this.updateInterval = 450; // ms
                break;
            // Two speed, seven cycles per second.
            case 2:
                this.updateInterval = 150; // ms
                break;
            // Three speed, twenty cycles per second.
            case 3:
                this.updateInterval = 50; // ms
                break;
        }
    }

    updateElement(state: Simulation | undefined): void {
    }
}