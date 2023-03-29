import {Widget} from '../../../widget';
import {NavigationBarButtons} from './navigation-bar-buttons';
import {Game} from '../../game';

// A navigation rail, the number determines which one gets selected.
export class NavigationBar extends Widget<number> {
    game: Game;
    buttons: NavigationBarButtons[] = [
        new NavigationBarButtons('government', 'Overview', 0, this),
        new NavigationBarButtons('population', 'Population', 1, this),
        new NavigationBarButtons('markets', 'Markets', 2, this),
        new NavigationBarButtons('resources', 'Resources', 3, this),
        new NavigationBarButtons('factory', 'Factories', 4, this),
        new NavigationBarButtons('technology', 'Technology', 5, this),
    ]

    constructor(game: Game) {
        super('div', 'navigation');

        this.game = game;

        // Start with the first one selected.
        this.lastState = 0;

        // Add the buttons to the dom element.
        this.buttons.forEach((button) => this.domElement.append(button.domElement));
    }

    updateElement(state: number): void {
        for (let i = 0; i < this.buttons.length; i++) {
            // Set the button to selected if its index is the current state.
            this.buttons[i].updateElement(i == state);
        }

        // Update the game's content based on which one was selected.
        this.game.updateSelection(state);
    }
}