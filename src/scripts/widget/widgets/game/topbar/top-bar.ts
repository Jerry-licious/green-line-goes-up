import {Widget} from '../../widget';
import {NavigationBar} from './nav/navigation-bar';
import {Div, Span} from '../../../builders/common-elements';
import {Game} from '../game';
import {TimeControl} from './time/time-control';


export class TopBar extends Widget<null> {
    game: Game;
    navigationBar: NavigationBar;
    timeControl: TimeControl;

    gdpDisplay = Span.simple('0', []).build();
    moneyDisplay = Span.simple('0', []).build();

    constructor(game: Game) {
        super('div', 'top-bar');

        this.game = game;
        this.navigationBar = new NavigationBar(game);
        this.timeControl = new TimeControl(game);

        this.domElement.append(
            this.navigationBar.domElement,
            new Div({styleClasses: ['fill']}).build(),
            new Div({
                styleClasses: ['info'],
                children: [
                    // GDP
                    new Div({
                        children: [
                            Span.simple('trending_up', ['material-icons']).build(),
                            this.gdpDisplay
                        ]
                    }).build(),
                    new Div({
                        children: [
                            Span.simple('paid', ['material-icons']).build(),
                            this.moneyDisplay
                        ]
                    }).build()
                ]
            }).build(),
            this.timeControl.domElement
        );
    }

    updateElement(): void {}
}