import {GameWidget} from '../game-widget';
import {MarketListButton} from './market-list-button';
import {Game} from '../game';
import {MarketsWidget} from './markets-widget';

export class MarketList extends GameWidget<number> {
    marketButtons: MarketListButton[] = [];
    container: MarketsWidget;

    constructor(game: Game, container: MarketsWidget) {
        super(game, 'div', 'list');

        this.container = container;

        this.lastState = 0;
    }

    gameTick(): void {
        // Add markets that haven't been included yet.
        Array.from(this.game.simulation.markets.values())
            .filter((market) => !this.marketButtons.some((widget) => widget.market == market))
            .forEach((newMarket, index) => {
                let newButton = new MarketListButton(this.game, this, newMarket, this.marketButtons.length);

                this.marketButtons.push(newButton);
                this.domElement.append(newButton.domElement);
            });

        for (let button of this.marketButtons) {
            button.gameTick();
        }
    }

    updateElement(state: number): void {
        for (let i = 0; i < this.marketButtons.length; i++) {
            this.marketButtons[i].updateElement(i == state);
        }

        this.container.updateElement(state);
    }
}