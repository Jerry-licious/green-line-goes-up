import {LineChart} from 'chartist';
import {GameWidget} from '../game-widget';
import {Game} from '../game';
import {Market} from '../../../../simulation/market';
import {Div} from '../../../builders/common-elements';
import {Config} from '../../../../simulation/configs';

export class MarketDetails extends GameWidget<null> {
    market: Market;
    chartElement: Element = Div.simple('', ['ct-chart']).build();
    chart: LineChart;

    constructor(game: Game, market: Market) {
        super(game, 'div', 'details');

        this.market = market;

        this.domElement.append(
            new Div({
                styleClasses: ['chart'],
                children: [
                    this.chartElement
                ]
            }).build()
        );

        this.chart = new LineChart(this.chartElement, {
            series: [market.exchangePriceHistory]
        }, Config.graphConfigs);
    }

    gameTick(): void {
        this.chart.update();
    }

    updateElement(state: null | undefined): void {
    }
}