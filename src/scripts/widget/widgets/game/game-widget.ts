import {Widget} from '../widget';
import {Game} from './game';

// A game widget responds to the state of the game, and updates whenever the game updates.
export abstract class GameWidget<S> extends Widget<S> {
    game: Game;

    constructor(game: Game, tag: string, ...styleClasses: string[]) {
        super(tag, ...styleClasses);

        this.game = game;
    }

    // Called whenever the game advances by a tick.
    abstract gameTick(): void
}