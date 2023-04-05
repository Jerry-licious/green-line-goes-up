import {GameWidget} from '../game-widget';
import {MarketList} from './market-list';
import {Game} from '../game';
import {Market} from '../../../../simulation/market';
import {Div, MaterialIcon, Span} from '../../../builders/common-elements';
import {Good} from '../../../../simulation/good';

export class MarketListButton extends GameWidget<boolean> {
    index: number;
    // Owner
    list: MarketList;

    market: Market;

    price: Element = Span.simple('0', []).build();
    quantity: Element = Span.simple('0', []).build();

    constructor(game: Game, list: MarketList, market: Market, index: number) {
        super(game, 'a', 'market');

        this.list = list;
        this.market = market;

        this.domElement.append(
            Div.simple(market.good, ['green-line']).build(),
            new Div({
                styleClasses: ['info'],
                children: [
                    Div.simple(Good.name(market.good), ['name']).build(),
                    new Div({
                        styleClasses: ['data'],
                        children: [
                            new Div({
                                children: [
                                    new MaterialIcon('sell').build(),
                                    this.price
                                ]
                            }).build(),
                            new Div({
                                children: [
                                    new MaterialIcon('swap_horiz').build(),
                                    this.quantity
                                ]
                            }).build()
                        ]
                    }).build()
                ]
            }).build()
        )

        this.domElement.addEventListener('click', function() {
            list.render(index);
        });
    }

    updateElement(state: boolean): void {
        if (state) {
            this.domElement.classList.add('selected');
        } else {
            this.domElement.classList.remove('selected');
        }
    }

    gameTick() {
        this.price.innerHTML = (Math.round(this.market.currentExchangePrice * 100) / 100).toString();
        this.quantity.innerHTML = this.market.currentExchangeQuantity.toString();
    }
}