import {Good} from '../good';
import {gaussianRandom} from '../../util/random';
import {Basket} from '../basket';
import {Config} from '../configs';
import {Simulation} from '../simulation';
import {EconomicActor} from './economic-actor';
import {Order} from '../order';


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

    preferences: Good[] = [];
    // The type of labour that the individual is best at.
    mostProductiveLabour: Good = Good.Farming;
    // The type of labour that the individual actually produces.
    job: Good = Good.Farming;
    lastUtility: number = 50;

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
            // this.personalValues.set(labour, Config.baseLabourValue);
            // Individuals do not consume labour, and therefore do not value them.
            // However, they do expect their work to be worth something.
            this.expectedMarketPrices.set(labour, Config.baseLabourValue);

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

    // If this actor wants something and can afford it.
    willingAndAbleToBuy(simulation: Simulation, currentBasket: Basket, desiredGood: Good) {
        return simulation.goodsSold.some((good) =>
            good == desiredGood && this.personalValues.get(good) > 0 && currentBasket.money > this.expectedPrice(good));
    }

    // The actor evaluates different consumption possibilities and creates a new basket that provides the highest
    // amount of utility.
    decideSpendingBasket(simulation: Simulation): Basket {
        let currentPurchase = this.inventory.copy();
        let purchasableGoods = simulation.goodsSold.filter((good) => this.willingAndAbleToBuy(simulation, currentPurchase, good));

        // Repeatedly consider if new goods can be bought.
        while (purchasableGoods.length > 0) {
            // Update the new basket.
            // Filter only goods that the person can afford.
            let bestNextGood = purchasableGoods.map((good) => {
                    return {
                        good,
                        marginalMoneyEfficiency: 1 / currentPurchase.get(good) / this.expectedPrice(good)
                    }
                })  // Return the basket with the largest utility
                .reduce((previous, current) =>
                    previous.marginalMoneyEfficiency > current.marginalMoneyEfficiency ? previous : current).good;


            currentPurchase.addGood(bestNextGood, 1);
            currentPurchase.money -= this.expectedPrice(bestNextGood);

            purchasableGoods = simulation.goodsSold.filter((good) => this.willingAndAbleToBuy(simulation, currentPurchase, good));
        }

        // Sort for the goods that provide the most utility.
        let preferences = Array.from(currentPurchase.keys()).map(
            (good) => {
                return {
                    good,
                    utility: utilityFunction(currentPurchase.get(good)) * this.personalValues.get(good)
                }
            })
            .sort((a, b) => b.utility - a.utility)
            .filter((good) => good.utility > 0)
            .map((good) => good.good);

        // Pick the top 3.
        this.preferences = preferences.slice(0, Math.min(3, preferences.length));

        // Returns the final basket.
        return currentPurchase;
    }

    setSellGoals(simulation: Simulation) {
        let mostProfitableLabour = Good.labourTypes.map((labour) =>
            // Calculate the expected income for each type of labour.
                { return { labour, expectedIncome: this.expectedPrice(labour) * this.productivity.get(labour) } })
            .reduce((previous, current) =>
                previous.expectedIncome > current.expectedIncome ? previous : current).labour;

        this.sellGoal = new Map<Good, number>([[mostProfitableLabour,
            Math.floor(this.productivity.get(mostProfitableLabour))]]);

        this.mostProductiveLabour = Array.from(this.productivity.keys())
            .reduce((prev, curr) => this.productivity.get(prev) > this.productivity.get(curr) ? prev : curr);
        this.job = mostProfitableLabour;
    }

    placeSellOrders(simulation: Simulation) {
        this.setSellGoals(simulation);
        for (let goal of this.sellGoal) {
            // Individuals will sell things at an expected price based on their productivity. This isn't the actual
            // expected price, but is used to sort out the most productive people.
            let sellOrder = new Order(this, goal[0], 1 / this.productivity.get(goal[0]));
            for (let i = 0; i < goal[1]; i++) {
                simulation.placeSellOrder(sellOrder);
            }
        }
    }

    setBuyGoals(simulation: Simulation) {
        // First clear the buy goal.
        this.buyGoal = new Map<Good, number>();
        for (let goal of this.decideSpendingBasket(simulation)) {
            // If the actor wants to buy something.
            if (goal[1] > 0) {
                this.buyGoal.set(goal[0], goal[1]);
            }
        }
    }

    // When the seller successfully sells their labour, they may specialise.
    onSuccessfulSale(good: Good) {
        super.onSuccessfulSale(good);
        if (this.productivity.has(good)) {
            let currentProductivity = this.productivity.get(good);
            // They slightly increase their productivity. The more productive they already are, the less they will
            // improve.
            // this.productivity.set(good, currentProductivity + Config.specialisationFactor / currentProductivity);
        }
    }

    // At the end of each day, all actors consume what they bought.
    consumeGoods() {
        this.lastUtility = this.utilityOf(this.inventory);

        for (let good of this.inventory.keys()) {
            this.inventory.set(good, 0);
        }
    }

    // Used for the real GDP.
    calculateInventoryValue(): number {
        return Array.from(this.inventory.entries())
            .map((entry) => Good.getBaseUtility(entry[0]) * entry[1])
            .reduce((a, b) => a + b, 0)
    }
}