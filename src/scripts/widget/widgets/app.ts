import {Widget} from './widget';
import {MainMenu} from './main-menu';
import {Game} from './game/game';
import {Tutorial} from './tutorial';

export class App extends Widget<null> {
    mainMenu = new MainMenu(this);
    tutorial = new Tutorial(this);
    game = new Game();

    constructor() {
        super('div', 'app');

        this.domElement.append(this.mainMenu.domElement);
    }

    play() {
        this.clearElement();
        this.domElement.append(this.game.domElement);
    }

    openTutorial() {
        this.clearElement();
        this.domElement.append(this.tutorial.domElement);
    }

    menu() {
        this.clearElement();
        this.domElement.append(this.mainMenu.domElement);
    }

    updateElement(state: null | undefined): void {}
}