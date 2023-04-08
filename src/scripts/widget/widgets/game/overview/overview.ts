import {GameWidget} from '../game-widget';
import {Game} from '../game';
import {ItemList} from '../item-list/item-list';
import {Div} from '../../../builders/common-elements';
import {LineChart} from 'chartist';
import {Config} from '../../../../simulation/configs';
import {FactorsOfProductionWidget} from './factors-of-production-widget';

export class Overview extends GameWidget<null> {
    inventory: ItemList;
    orders: ItemList;
    factors: FactorsOfProductionWidget;

    chartElement: Element = Div.simple('', ['ct-chart']).build();
    chart: LineChart;

    constructor(game: Game) {
        super(game, 'div', 'overview');

        this.inventory = new ItemList(game.simulation.government.inventory, 'Inventory', false, false);
        this.orders = new ItemList(game.simulation.government.orderGoal, 'Orders', false, true);
        this.factors = new FactorsOfProductionWidget(game);

        this.domElement.append(
            new Div({
                styleClasses: ['graph-container'],
                children: [
                    Div.simple('Real GDP', ['title']).build(),
                    this.chartElement
                ]
            }).build(),
            new Div({
                styleClasses: ['info'],
                children: [
                    this.inventory.domElement,
                    this.orders.domElement,
                    this.factors.domElement
                ]
            }).build()
        );

        this.chart = new LineChart(this.chartElement, {
            series: [game.simulation.realGDPHistory]
        }, Config.graphConfigs);
    }

    gameTick(): void {
        this.inventory.render();
        this.orders.render();
        this.chart.update();
        this.factors.gameTick();
    }

    updateElement(state: null | undefined): void {}
}