import {GameWidget} from '../game-widget';
import {Game} from '../game';
import {Market} from '../../../../simulation/market';
import {Div, MaterialIcon, Span} from '../../../builders/common-elements';
import {ElementBuilder} from '../../../builders/element-builder';


export class MarketOrderMenu extends GameWidget<null> {
    market: Market;

    inventory: Element = Span.simple('0', []).build();
    pendingOrders: Element = Span.simple('0', []).build();
    cost: Element = Span.simple('0', []).build();

    amount: Element = new ElementBuilder({tag: 'input'})
        .withAttribute('type', 'number').build();

    orderButton: Element = new ElementBuilder({
        tag: 'button',
        styleClasses: ['primary'],
        text: 'Order'
    }).build();

    constructor(game: Game, market: Market) {
        super(game, 'div', 'order-menu');

        this.market = market;

        this.domElement.append(
            Div.simple('Purchase', ['title']).build(),
            new Div({
                styleClasses: ['entry'],
                children: [
                    new MaterialIcon('inventory')
                        .withAttribute('title', 'Inventory').build(),
                    this.inventory
                ]
            }).build(),
            new Div({
                styleClasses: ['entry'],
                children: [
                    new MaterialIcon('pending')
                        .withAttribute('title', 'Pending Orders').build(),
                    this.pendingOrders
                ]
            }).build(),
            new Div({
                styleClasses: ['entry'],
                children: [
                    new MaterialIcon('monetization_on')
                        .withAttribute('title', 'Estimated Cost').build(),
                    this.cost
                ]
            }).build(),
            this.amount,
            this.orderButton
        );

        this.amount.addEventListener('input', (event) => {
            let target = event.target as HTMLInputElement;

            if (parseFloat(target.value) < 0) { target.value = '0' }
            if (parseFloat(target.value) % 1 != 0) { target.value = parseInt(target.value).toString(); }

            this.onAmountChange();
        });


        this.orderButton.addEventListener('click', () => {
            this.game.simulation.government.addBuyGoal(this.market.good, this.intendedAmount);

            // Update the numbers.
            this.gameTick();
        });
    }

    get intendedAmount(): number {
        let amount = parseInt((this.amount as HTMLInputElement).value);

        if (isNaN(amount)) {
            return 0;
        } else {
            return amount;
        }
    }

    onAmountChange() {
        let amount = this.intendedAmount;

        this.cost.innerHTML = (Math.round(amount * this.market.currentExchangePrice * 100) / 100).toString();

        if (amount > 0) {
            this.orderButton.setAttribute('disabled', 'false');
        } else {
            this.orderButton.setAttribute('disabled', 'true');
        }
    }


    gameTick(): void {
        this.inventory.innerHTML = this.game.simulation.government.inventory.get(this.market.good).toString();
        if (this.game.simulation.government.buyGoal.has(this.market.good)) {
            this.pendingOrders.innerHTML = this.game.simulation.government.buyGoal.get(this.market.good).toString();
        } else {
            this.pendingOrders.innerHTML = '0';
        }
    }

    updateElement(state: number | undefined): void {
    }
}