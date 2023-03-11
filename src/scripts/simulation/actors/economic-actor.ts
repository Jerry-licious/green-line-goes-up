import {Good} from '../good';
import {Basket} from '../basket';
import {Config} from '../configs';
import {Simulation} from '../simulation';


export abstract class EconomicActor {
    // The expected market price of each good, used to decide what stuff to buy.
    expectedMarketPrices: Map<Good, number> = new Map<Good, number>();

    // The amount of goods/services in an actor's possession.
    inventory: Basket;

    constructor() {
        // Initialise an empty inventory.
        this.inventory = new Basket();
    }
    // At the beginning of each day, an actor must place buy and sell orders.
    abstract placeSellOrders(simulation: Simulation): void;
    abstract placeBuyOrders(simulation: Simulation) : void;

    // Triggered when the actor sells something on the market.
    abstract onSuccessfulSale(good: Good): void;

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
        if (newPrice <= 0) {
            newPrice = Config.lowestPossiblePrice;
        }
        this.setExpectedPrice(good, newPrice);
    }
}