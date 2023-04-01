import {Game} from '../../game';
import {TimeControlButton} from './time-control-button';
import {Div} from '../../../../builders/common-elements';
import {GameWidget} from '../../game-widget';

export class TimeControl extends GameWidget<number> {
    buttons: TimeControlButton[] = [
        new TimeControlButton('pause', 0, this),
        new TimeControlButton('play_arrow', 1, this),
        new TimeControlButton('forward', 2, this),
        new TimeControlButton('fast_forward', 3, this),
    ];

    timeDisplay = Div.simple('Cycle 0', ['current-time']).build();

    constructor(game: Game) {
        super(game, 'div', 'time');

        // Start with the game paused.
        this.lastState = 0;
        this.buttons[0].updateElement(true);

        this.domElement.append(
            this.timeDisplay,
            new Div({
                styleClasses: ['control'],
                children: this.buttons.map((button) => button.domElement)
            }).build()
        )
    }

    updateTime() {
        this.timeDisplay.innerHTML = `Cycle ${0}`;
    }

    updateElement(state: number) {
        for (let i = 0; i < this.buttons.length; i++) {
            // Set the button to be selected if it matches the index.
            this.buttons[i].updateElement(i == state);
        }
    }

    gameTick() {
        this.updateTime();
    }
}