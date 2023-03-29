import {Widget} from '../../widget';
import {NavigationBar} from './nav/navigation-bar';
import {Div} from '../../../builders/common-elements';
import {Game} from '../game';

type TopBarInfo = {

};

export class TopBar extends Widget<TopBarInfo> {
    game: Game;
    navigationBar: NavigationBar;

    constructor(game: Game) {
        super('div', 'top-bar');

        this.game = game;
        this.navigationBar = new NavigationBar(game);

        this.domElement.append(
            this.navigationBar.domElement,
            new Div({styleClasses: ['fill']}).build(),
            new Div({styleClasses: ['info']}).build()
        );

        this.lastState = {};
    }

    updateElement(state: TopBarInfo): void {
    }
}