import {Good} from './good';
import {Config} from './configs';

// Represents a collection of goods.
// With each number representing the number of that good in the basket.
export class Basket extends Map<Good, number> {
    // The amount of money in the basket.
    money: number = 0;

    constructor() {
        super();
        // Initialise the basket to be empty.
        for (let good of Good.values) {
            this.set(good, 0);
        }
    }

    // Creates the initial inventory for an individual.
    static individualInitialInventory(): Basket {
        let inventory = new Basket();
        inventory.money = Config.initialMoneyPerIndividual;
        return inventory;
    }
    // Creates the initial inventory for a firm.
    static firmInitialInventory(): Basket {
        let inventory = new Basket();
        inventory.money = Config.initialMoneyPerFirm;
        return inventory;
    }

    // Changes the number of goods in this basket.
    addGood(good: Good, amount: number = 1) {
        this.set(good, this.get(good) + amount);
    }

    // Makes a new copy of the current basket.
    copy(): Basket {
        let copy = new Basket();
        copy.money = this.money;
        for (let good of Good.values) {
            copy.set(good, this.get(good));
        }
        return copy;
    }
}