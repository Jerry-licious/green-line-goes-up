import {LineChart} from 'chartist';
import {GameWidget} from '../game-widget';
import {Game} from '../game';
import {Market} from '../../../../simulation/market';
import {Div} from '../../../builders/common-elements';
import {Config} from '../../../../simulation/configs';
import {MarketOrderMenu} from './market-order-menu';

export class MarketDetails extends GameWidget<null> {
    market: Market;
    chartElement: Element = Div.simple('', ['ct-chart']).build();
    orderMenu: MarketOrderMenu;
    chart: LineChart;

    constructor(game: Game, market: Market) {
        super(game, 'div', 'details');

        this.market = market;

        this.orderMenu = new MarketOrderMenu(game, market);

        this.domElement.append(
            new Div({
                styleClasses: ['chart'],
                children: [
                    Div.simple('Price', ['title']).build(),
                    this.chartElement
                ]
            }).build(),
            new Div({
                styleClasses: ['misc'],
                children: [
                    this.orderMenu.domElement
                ]
            }).build()
        );

        this.chart = new LineChart(this.chartElement, {
            series: [market.exchangePriceHistory]
        }, Config.graphConfigs);
    }

    gameTick(): void {
        this.chart.update();
        this.orderMenu.gameTick();
    }

    updateElement(state: null | undefined): void {}
}