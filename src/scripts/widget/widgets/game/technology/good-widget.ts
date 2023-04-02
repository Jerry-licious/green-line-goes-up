import {GameWidget} from '../game-widget';
import {Good} from '../../../../simulation/good';
import {Game} from '../game';
import {Div, GameIcon} from '../../../builders/common-elements';

export class GoodWidget extends GameWidget<null> {
    good: Good;

    constructor(game: Game, good: Good) {
        super(game, 'div', 'good');

        this.good = good;

        this.domElement.append(
            new GameIcon(good).build(),
            Div.simple(Good.name(good), ['name']).build(),
            Div.simple(`Value: ${Good.getBaseUtility(good)}`, ['value']).build()
        );
    }

    gameTick() {
        if (this.game.simulation.markets.has(this.good) &&
            !this.domElement.classList.contains('unlocked')) {
            this.domElement.classList.add('unlocked');
        }
    }

    updateElement(state: null | undefined): void {}
}