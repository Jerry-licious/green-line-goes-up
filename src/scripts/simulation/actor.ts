import {Good} from './good';
import {gaussianRandom} from '../util/random';
import {Basket} from './basket';
import {Config} from './configs';
import {Simulation} from './simulation';


// The utility function of the actor, representing the amount of utility it obtains from consuming a given good.
function utilityFunction(x: number) {
    // log2(x + 1) has two good properties:
    // 1. The (x + 1) part makes the utility 0 when x is 0.
    // 2. u(1) returns exactly 1.
    return Math.log2(x + 1);
}

export class Actor {
    moneyValue: number;
    // How much a given actor values each good, based on their utility.
    personalValues: Map<Good, number> = new Map<Good, number>();
    // The expected market price of each good, used to decide what stuff to buy.
    expectedMarketPrices: Map<Good, number> = new Map<Good, number>();

    // How many units of each labour can an actor produce each day.
    productivity: Map<Good, number> = new Map<Good, number>();

    // The amount of goods/services in an actor's possession.
    inventory: Basket;

    personalValue: number;
    expectedMarketPrice: number;

    constructor() {
        this.personalValue = Math.random() * 9 + 2;
        this.expectedMarketPrice = Math.random() * 20;

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
            this.moneyValue = Config.baseMoneyValue * Math.min(0.1,
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
        this.inventory = Basket.actorInitialInventory();
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

        console.log(this.personalValues);

        // Repeatedly consider if new goods can be bought.
        do {
            // Update the current basket to the previous basket.
            currentPurchase = bestNextPurchase;

            // Update the new basket.
            // Filter only goods that the person can afford.
            bestNextPurchase = simulation.goodsSold.filter((good) => currentPurchase.basket.money > this.expectedPrice(good))
                .map((good) => {
                    console.log("Trying to buy " + good)
                    // Make a copy of the current basket
                    let newBasketIfBought = currentPurchase.basket.copy();

                    // Simulate spending the money and buying the good.
                    newBasketIfBought.incrementGood(good);
                    newBasketIfBought.money -= this.expectedPrice(good);

                    console.log(newBasketIfBought);
                    console.log(this.utilityOf(newBasketIfBought));

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

    expectedPrice(good: Good): number {
        return this.expectedMarketPrices.get(good);
    }
    setExpectedPrice(good: Good, value: number) {
        this.expectedMarketPrices.set(good, value);
    }
    changeExpectedPrice(good: Good, value: number) {
        this.setExpectedPrice(good, this.expectedPrice(good) + value);
    }
}