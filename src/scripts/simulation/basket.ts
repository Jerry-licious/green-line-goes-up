import {Good} from './good';

// Represents a collection of goods.
// With each number representing the number of that good in the basket.
export class Basket extends Map<Good, number> {
    // The amount of money in the basket.
    money: number = 0;

    constructor() {
        super();
        // Initialise the basket to be empty.
        Good.values.forEach((good) => {
            this.set(good, 0);
        });
    }

    // function changeAmount(Good, )
}