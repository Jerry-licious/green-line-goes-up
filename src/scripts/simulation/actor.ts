//
import {Good} from './good';
import {gaussianRandom} from '../util/random';
import {Basket} from './basket';

// Allows different actors to like each good differently.
const personalUtilityMultiplierStandardDeviation = 0.25;

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
    personalValues: Map<Good, number>;
    // The expected market price of each good, used to decide what stuff to buy.
    expectedMarketPrices: Map<Good, number>;

    personalValue: number;
    expectedMarketPrice: number;

    constructor() {
        this.personalValue = Math.random() * 9 + 2;
        this.expectedMarketPrice = Math.random() * 20;

        Good.values.forEach((good: Good) => {
            // Randomise preferences such that each actor likes things differently.
            this.personalValues.set(good, Good.getBaseUtility(good) *
                // Make sure that negative preferences doesn't happen for some reason.
                Math.min(0, gaussianRandom(1.0, personalUtilityMultiplierStandardDeviation)));
            this.expectedMarketPrices.set(good, this.personalValues.get(good));

            // How much a person values saving money can also be randomised.
            // The min value has to be greater than 0, otherwise a person would be indifferent towards money and go
            // into debt.
            this.moneyValue = 5 * Math.min(0.1, gaussianRandom(1.0, personalUtilityMultiplierStandardDeviation));
        });
    }

    // Calculates the utility of a particular basket of goods.
    utilityOf(basket: Basket) {
        let totalUtility = 0;
        // Loop through each item.
        Good.values.forEach((good: Good) => {
            // Since u(1) = 1, the output of the utility function will be directly multiplied by the personal value,
            // making the first of each good's worth exactly equal to the personal value.
            totalUtility += this.personalValues.get(good) * utilityFunction(basket.get(good));
        });
    }
}