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

    static withItems(items: Map<Good, number>): Basket {
        let basket = new Basket();
        for (let item of items) {
            basket.set(item[0], item[1]);
        }
        return basket;
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

    // Returns a new basket with certain elements removed.
    subtract(other: Basket): Basket {
        let result = this.copy();

        for (let entry of other) {
            if (result.has(entry[0])) {
                result.addGood(entry[0], -entry[1]);
            } else {
                result.set(entry[0], -entry[1]);
            }
        }

        return result;
    }

    // Modifies the current basket by subtracting things.
    removeItemsFrom(other: Basket) {
        for (let entry of other) {
            if (this.has(entry[0])) {
                this.addGood(entry[0], -entry[1]);
            } else {
                this.set(entry[0], -entry[1]);
            }
        }
    }

    // Returns true if any item has a negative value.
    hasNegatives(): boolean {
        return Array.from(this.values()).some((amount) => amount < 0);
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