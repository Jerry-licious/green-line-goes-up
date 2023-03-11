import {Good} from '../good';
import {gaussianRandom} from '../../util/random';
import {Basket} from '../basket';
import {Config} from '../configs';
import {Simulation} from '../simulation';
import {Order} from '../order';
import {EconomicActor} from './economic-actor';


// The utility function of the actor, representing the amount of utility it obtains from consuming a given good.
function utilityFunction(x: number) {
    // log2(x + 1) has two good properties:
    // 1. The (x + 1) part makes the utility 0 when x is 0.
    // 2. u(1) returns exactly 1.
    return Math.log2(x + 1);
}

export class Individual extends EconomicActor {
    // How much the actor values money.
    moneyValue: number;
    // How much a given actor values each good, based on their utility.
    personalValues: Map<Good, number> = new Map<Good, number>();

    // How many units of each labour can an actor produce each day.
    productivity: Map<Good, number> = new Map<Good, number>();

    constructor() {
        super();

        // Initialise actor preferences.
        for (let good of Good.values) {
            // Randomise preferences such that each actor likes things differently.
            this.personalValues.set(good, Good.getBaseUtility(good) *
                // Make sure that negative preferences doesn't happen for some reason.
                Math.max(0, gaussianRandom(1.0, Config.personalUtilityMultiplierStandardDeviation)));
            this.setExpectedPrice(good, this.personalValues.get(good));

            // How much a person values saving money can also be randomised.
            // The min value has to be greater than 0, otherwise a person would be indifferent towards money and go
            // into debt.
            this.moneyValue = Config.baseMoneyValue * Math.max(0.1,
                gaussianRandom(1.0, Config.personalUtilityMultiplierStandardDeviation));
        }

        // Initialise actor productivity.
        for (let labour of Good.labourTypes) {
            this.personalValues.set(labour, Config.baseLabourValue);
            this.expectedMarketPrices.set(labour, this.personalValues.get(labour));

            // Set the base productivity of each person.
            this.productivity.set(labour, Config.baseLabourOutput * Math.max(0.1,
                gaussianRandom(1.0, Config.labourOutputUtilityMultiplierStandardDeviation)));
        }

        // Initialise actor inventory.
        this.inventory = Basket.individualInitialInventory();
    }

    // Calculates the utility of a particular basket of goods.
    utilityOf(basket: Basket): number {
        let totalUtility = 0;
        // Loop through each item.
        for (let good of Good.values) {
            // Since u(1) = 1, the output of the utility function will be directly multiplied by the personal value,
            // making the first of each good's worth exactly equal to the personal value.
            totalUtility += this.personalValues.get(good) * utilityFunction(basket.get(good));
        }

        totalUtility += this.moneyValue * utilityFunction(basket.money);

        return totalUtility;
    }

    // The actor evaluates different consumption possibilities and creates a new basket that provides the highest
    // amount of utility.
    decideSpendingBasket(simulation: Simulation): Basket {
        let currentPurchase = {
            basket: this.inventory,
            utility: this.utilityOf(this.inventory)
        }
        let bestNextPurchase = currentPurchase;

        // Repeatedly consider if new goods can be bought.
        do {
            // Update the current basket to the previous basket.
            currentPurchase = bestNextPurchase;

            // Update the new basket.
            // Filter only goods that the person can afford.
            bestNextPurchase = simulation.goodsSold.filter((good) => currentPurchase.basket.money > this.expectedPrice(good))
                .map((good) => {
                    // Make a copy of the current basket
                    let newBasketIfBought = currentPurchase.basket.copy();

                    // Simulate spending the money and buying the good.
                    newBasketIfBought.addGood(good);
                    newBasketIfBought.money -= this.expectedPrice(good);

                    return {
                        basket: newBasketIfBought,
                        utility: this.utilityOf(newBasketIfBought)
                    }
                })  // Return the basket with the largest utility
                .reduce((previous, current) =>
                    previous.utility > current.utility ? previous : current, currentPurchase);
        } while (bestNextPurchase.utility > currentPurchase.utility);

        // Returns the final basket.
        return currentPurchase.basket;
    }

    // Chooses the type of labour that they will produce for the day based on the expected market prices.
    decideWork(): Good {
        return Good.labourTypes.map((labour) =>
            // Calculate the expected income for each type of labour.
                { return { labour, expectedIncome: this.expectedPrice(labour) * this.productivity.get(labour) } })
            .reduce((previous, current) =>
                previous.expectedIncome > current.expectedIncome ? previous : current).labour;
    }

    // At the beginning of each day, an actor will pick the most profitable work and sell it for money.
    placeSellOrders(simulation: Simulation) {
        let work = this.decideWork();
        // While a worker's productivity may be decimal, buy and sell orders are all done one at a time. So no
        // fractional amount of labours will be sold.
        // I know that you don't have to round this, but it's here to clarify the mechanic.
        for (let i = 0; i < Math.floor(this.productivity.get(work)); i++) {
            simulation.placeSellOrder(new Order(this, work, this.expectedPrice(work)));
        }
    }

    // After working, an actor decides on what to spend the wage on and buys a bunch of stuff.
    placeBuyOrders(simulation: Simulation) {
        let basket = this.decideSpendingBasket(simulation);

        basket.forEach((amount, good) => {
            for (let i = 0; i < amount; i++) {
                simulation.placeBuyOrder(new Order(this, good, this.expectedPrice(good)));
            }
        });
    }

    // When the seller successfully sells their labour, they may specialise.
    onSuccessfulSale(good: Good) {
        if (this.productivity.has(good)) {
            let currentProductivity = this.productivity.get(good);
            // They slightly increase their productivity. The more productive they already are, the less they will
            // improve.
            this.productivity.set(good, currentProductivity + Config.specialisationFactor / currentProductivity);
        }
    }

    // At the end of each day, all actors consume what they bought.
    consumeGoods() {
        // TODO: Track utility?
        for (let good of this.inventory.keys()) {
            this.inventory.set(good, 0);
        }
    }

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