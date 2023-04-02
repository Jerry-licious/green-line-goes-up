import {GameWidget} from '../game-widget';
import {Game} from '../game';
import {MarketList} from './market-list';
import {Div} from '../../../builders/common-elements';
import {MarketDetails} from './market-details';
import {MarketListButton} from './market-list-button';

export class MarketsWidget extends GameWidget<number> {
    marketList: MarketList;
    details: MarketDetails[] = [];
    infoContainer: Element = Div.simple('', ['details-container']).build();

    constructor(game: Game) {
        super(game, 'div', 'markets');

        this.marketList = new MarketList(game, this);

        this.lastState = 0;

        this.domElement.append(
            this.marketList.domElement,
            this.infoContainer
        )
    }

    gameTick(): void {
        // Add markets that haven't been included yet.
        Array.from(this.game.simulation.markets.values())
            .filter((market) => !this.details.some((widget) => widget.market == market))
            .forEach((newMarket) => {
                let newDetails = new MarketDetails(this.game, newMarket);

                this.details.push(newDetails);
            });

        // Avoid lagging by only drawing the graph on display.
        this.details[this.lastState].gameTick();
        this.marketList.gameTick();
    }

    updateElement(state: number): void {
        this.removeChildren(this.infoContainer);

        this.infoContainer.append(this.details[state].domElement);

        this.lastState = state;
        this.details[this.lastState].gameTick();
    }
}