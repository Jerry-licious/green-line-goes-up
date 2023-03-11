import {EconomicActor} from './economic-actor';
import {Good} from '../good';
import {Simulation} from '../simulation';
import {Basket} from '../basket';
import {Recipe} from './recipe';
import {Config} from '../configs';
import {Order} from '../order';

// A firm is a type of actor that takes in some goods and output different goods.
export class Firm extends EconomicActor {
    // The recipe that the firm uses to transform labour.
    recipe: Recipe;

    constructor(recipe: Recipe) {
        super();

        for (let good of Good.values) {
            // Firms start off assuming that all things are worth some arbitrary price, so they can make buy and sell
            // orders. Over time they will adjust to the market price.
            this.setExpectedPrice(good, Config.baseLabourValue);
        }

        this.inventory = Basket.firmInitialInventory();
        this.recipe = recipe;
    }

    // Calculates the cost of buying materials required for one recipe.
    get recipeCost(): number {
        let totalCost = 0;
        for (let input of this.recipe.inputs) {
            totalCost += this.expectedPrice(input[0]) * input[1];
        }
        return totalCost;
    }

    // At the beginning of each day, a firm tries to buy as many things as possible for them to fill their recipe.
    placeBuyOrders(simulation: Simulation): void {
        // Determines the number of times to use the recipe.
        let amount = Math.floor(this.inventory.money / this.recipeCost);
        // Apply the recipe this many times.
        for (let i = 0; i < amount; i++) {
            // Place order for each of the inputs.
            for (let input of this.recipe.inputs.entries()) {
                for (let j = 0; j < input[1]; j++) {
                    simulation.placeBuyOrder(new Order(this, input[0], this.expectedPrice(input[0])));
                }
            }
        }
    }

    // The firm will always try to sell off all of its outputs.
    placeSellOrders(simulation: Simulation): void {
        for (let output of this.recipe.outputs.keys()) {
            for (let i = 0; i < this.inventory.get(output); i++) {
                simulation.placeSellOrder(new Order(this, output, this.expectedPrice(output)));
            }
        }
    }

    consumeGoods(): void {
        // The firm tries to execute the recipe for as many times as possible.
        while (this.recipe.canApply(this.inventory)) {
            this.recipe.apply(this.inventory);
        }
    }

    // When a firm successfully sells something, it loses that item.
    onSuccessfulSale(good: Good): void {
        this.inventory.addGood(good, -1);
    }
}