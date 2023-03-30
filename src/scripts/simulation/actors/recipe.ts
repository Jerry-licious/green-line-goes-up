import {Good} from '../good';
import {Basket} from '../basket';

// Inputs and outputs of a firm.
// The key to transforming labour into goods.
export class Recipe {
    inputs: Map<Good, number> = new Map<Good, number>();
    output: Good;
    outputQuantity: number;

    constructor(inputs: Map<Good, number>, output: Good, outputQuantity: number) {
        this.inputs = inputs;

        this.output = output;
        this.outputQuantity = outputQuantity;
    }

    copy(): Recipe {
        return new Recipe(this.inputs, this.output, this.outputQuantity);
    }

    // Check if the basket has enough things to apply a given recipe.
    canApply(basket: Basket) {
        return Array.from(this.inputs.keys()).every((good) => basket.get(good) >= this.inputs.get(good));
    }

    // Changes a basket's good by applying the recipe.
    apply(basket: Basket) {
        for (let input of this.inputs) {
            basket.addGood(input[0], -input[1]);
        }
        basket.addGood(this.output, this.outputQuantity);
    }
}