import {Widget} from '../widget';
import {Simulation} from '../../../simulation/simulation';
import {TopBar} from './topbar/top-bar';
import {Div} from '../../builders/common-elements';
import {FirmsContainer} from './firms/firms-container';
import {PopulationWidget} from './population/population';
import {MarketsWidget} from './markets/markets-widget';
import {Overview} from './overview/overview';
import {OverlayActionMenu} from './overlay-action-menu';

export class Game extends Widget<null> {
    simulation = new Simulation();

    firmsMenuOpened = false;
    actionMenuOpened = false;

    topBar = new TopBar(this);
    display = new Div({styleClasses: ['display']}).build();
    actionOverlay = new Div({styleClasses: ['spend-overlay']}).build() as HTMLDivElement;

    overview = new Overview(this);
    resources = new FirmsContainer(this, this.simulation.resources, true);
    factories = new FirmsContainer(this, this.simulation.factories, true);
    population = new PopulationWidget(this);
    markets = new MarketsWidget(this);

    timeSinceLastUpdate = 0.0;
    updateInterval = 0.0;

    constructor() {
        super('div', 'game');

        this.domElement.append(
            new Div({
                styleClasses: ['main'],
                children: [
                    this.topBar.domElement,
                    this.display
                ]
            }).build(),
            this.actionOverlay
        );

        this.tick();

        window.requestAnimationFrame((t) => this.update(t));
    }

    previousTime: number = 0;

    update(currentTime: number) {
        // Only update the simulation when the game isn't paused.
        if (this.updateInterval != 0 && !this.actionMenuOpened && !this.firmsMenuOpened) {
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

        this.overview.gameTick();
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
                // Extra updates to make sure that all information is accurate.
                this.display.append(this.overview.domElement);
                this.overview.gameTick();
                return;
            case 1:
                this.display.append(this.population.domElement);
                this.population.gameTick();
                return;
            case 2:
                this.display.append(this.markets.domElement);
                this.markets.gameTick();
                return;
            case 3:
                this.display.append(this.resources.domElement);
                this.resources.gameTick();
                return;
            case 4:
                this.display.append(this.factories.domElement);
                this.factories.gameTick();
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

    openActionMenu(menu: OverlayActionMenu) {
        this.actionMenuOpened = true;
        this.actionOverlay.style.display = 'block';
        this.actionOverlay.append(menu.domElement);
    }

    dismissActionMenu() {
        this.actionMenuOpened = false;
        this.actionOverlay.style.display = 'none';
        this.removeChildren(this.actionOverlay);
    }

    updateElement(state: Simulation | undefined): void {
    }
}