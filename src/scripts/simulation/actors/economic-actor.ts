import {Good} from '../good';
import {Basket} from '../basket';
import {Config} from '../configs';
import {Simulation} from '../simulation';
import {Order} from '../order';


export abstract class EconomicActor {
    // The amount of things an actor sets out to buy at the beginning of the day.
    buyGoal: Map<Good, number> = new Map<Good, number>();
    // The amount of things an actor sets out to sell at the beginning of the day.
    sellGoal: Map<Good, number> = new Map<Good, number>();

    // The expected market price of each good, used to decide what stuff to buy.
    expectedMarketPrices: Map<Good, number> = new Map<Good, number>();

    // The amount of goods/services in an actor's possession.
    inventory: Basket;

    protected constructor() {
        // Initialise an empty inventory.
        this.inventory = new Basket();
    }

    abstract setBuyGoals(simulation: Simulation): void;
    abstract setSellGoals(simulation: Simulation): void;

    // At the beginning of each day, an actor must place buy and sell orders.
    placeSellOrders(simulation: Simulation) {
        this.setSellGoals(simulation);
        for (let goal of this.sellGoal) {
            // Since actors don't keep the things they sell to themselves, they will take any price for buyers.
            // This doesn't un-constrain the system because their spending behaviour will still depend on their income.
            let sellOrder = new Order(this, goal[0], 0);
            for (let i = 0; i < goal[1]; i++) {
                simulation.placeSellOrder(sellOrder);
            }
        }
    }
    placeBuyOrders(simulation: Simulation) {
        this.setBuyGoals(simulation);
        for (let goal of this.buyGoal) {
            let buyOrder = new Order(this, goal[0], this.expectedPrice(goal[0]));
            for (let i = 0; i < goal[1]; i++) {
                simulation.placeBuyOrder(buyOrder);
            }
        }
    }

    // Triggered when the actor sells something on the market.
    onSuccessfulSale(good: Good): void {
        // Whenever an actor sells something, they "clear" their sell goal of their day.
        if (this.sellGoal.has(good)) {
            this.sellGoal.set(good, this.sellGoal.get(good) - 1);
        } else {
            console.error("Actor managed to sell something it didn't plan to sell.");
        }
    }
    onSuccessfulBuy(good: Good): void {
        if (this.buyGoal.has(good)) {
            this.buyGoal.set(good, this.buyGoal.get(good) - 1);
        } else {
            console.error("Actor managed to buy something it didn't plan to buy.");
        }
    }

    updatePriceExpectationsBasedOnGoals() {
        for (let goal of this.buyGoal) {
            // If the goal has not been met (cleared),
            if (goal[1] > 0) {
                // Try to raise the price next time.
                this.changeExpectedPrice(goal[0], Config.priceVolatilityFactor);
            } else {
                // If the goal has been cleared, try to lower the price for a better deal.
                this.changeExpectedPrice(goal[0], -Config.priceVolatilityFactor);
            }
        }
        for (let goal of this.sellGoal) {
            // If the goal has not been met (cleared),
            if (goal[1] > 0) {
                // Try to lower the price next time.
                this.changeExpectedPrice(goal[0], -Config.priceVolatilityFactor);
            } else {
                // If the goal has been cleared, try to raise the price for a better deal.
                this.changeExpectedPrice(goal[0], Config.priceVolatilityFactor);
            }
        }
    }

    // At the end of each day, all actors try to consume what they bought.
    abstract consumeGoods(): void;

    expectedPrice(good: Good): number {
        return this.expectedMarketPrices.get(good);
    }
    setExpectedPrice(good: Good, value: number) {
        this.expectedMarketPrices.set(good, value);
    }
    changeExpectedPrice(good: Good, value: number) {
        let newPrice = this.expectedPrice(good) + value;
        if (newPrice <= Config.lowestPossiblePrice) {
            newPrice = Config.lowestPossiblePrice;
        }
        this.setExpectedPrice(good, newPrice);
    }
}