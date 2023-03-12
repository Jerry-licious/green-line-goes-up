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
    // The maximum number of times by which the recipe can be used in a single tick.
    maxCapacity: number = 250;

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
    setBuyGoals(simulation: Simulation) {
        // Clear the previous buy goal.
        this.buyGoal = new Map<Good, number>();
        for (let input of this.recipe.inputs) {
            // Always buy to function at max capacity.
            this.buyGoal.set(input[0], input[1] * this.maxCapacity);
        }
    }

    placeBuyOrders(simulation: Simulation) {
        this.setBuyGoals(simulation);
        for (let goal of this.buyGoal) {
            // The portion of the cost that this component represents.
            let priceWeight = this.expectedPrice(goal[0]) / this.recipeCost;

            let buyOrder = new Order(this, goal[0], this.inventory.money / this.maxCapacity * priceWeight);
            for (let i = 0; i < goal[1]; i++) {
                simulation.placeBuyOrder(buyOrder);
            }
        }
    }

    setSellGoals(simulation: Simulation) {
        // Clear the previous sell goal.
        this.sellGoal = new Map<Good, number>();

        // Try to sell all the outputs.
        for (let output of this.recipe.outputs) {
            this.sellGoal.set(output[0], this.inventory.get(output[0]));
        }
    }

    consumeGoods(): void {
        // Clear off anything leftover?
        /*
        for (let output of this.recipe.outputs) {
            this.inventory.set(output[0], 0);
        }*/
        // The firm tries to execute the recipe for as many times as possible.
        while (this.recipe.canApply(this.inventory)) {
            this.recipe.apply(this.inventory);
        }
    }

    // When a firm successfully sells something, it loses that item.
    onSuccessfulSale(good: Good): void {
        super.onSuccessfulSale(good);
        this.inventory.addGood(good, -1);
    }
}