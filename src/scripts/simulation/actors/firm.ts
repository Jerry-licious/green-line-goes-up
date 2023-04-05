import {EconomicActor} from './economic-actor';
import {Good} from '../good';
import {Simulation} from '../simulation';
import {Basket} from '../basket';
import {Recipe} from './recipe';
import {Config} from '../configs';
import {Order} from '../order';
import {FirmTier} from '../firm-tier';
import {clamp} from '../../util/random';


// A firm is a type of actor that takes in some goods and output different goods.
export class Firm extends EconomicActor {
    baseRecipe: Recipe;
    // The recipe that the firm uses to transform labour.
    recipe: Recipe;
    // The maximum number of times by which the recipe can be used in a single tick.
    maxCapacity: number = 250;
    // How many times was the recipe used in the previous round.
    lastProduction: number = 0;
    id: string;

    // If this firm is industrial, does it consume coal?
    consumesCoal: boolean;
    // If this firm is advanced, does it consume electricity?
    consumesElectricity: boolean;

    startingTier: FirmTier;
    tier: FirmTier;
    finalTier: FirmTier;

    // Additional production attempts based on how successful the firm has been doing.
    productionOffset: number = this.maxCapacity / 2;

    constructor(id: string, recipe: Recipe, startingTier: FirmTier, finalTier: FirmTier,
                consumesCoal: boolean, consumesElectricity: boolean, capacity: number) {
        super();

        for (let good of Good.values) {
            // Firms start off assuming that all things are worth some arbitrary price, so they can make buy and sell
            // orders. Over time they will adjust to the market price.
            this.setExpectedPrice(good, Config.baseLabourValue);
        }

        this.id = id;

        this.inventory = Basket.firmInitialInventory();
        this.baseRecipe = recipe;
        this.recipe = recipe;

        this.startingTier = startingTier;
        this.tier = startingTier;
        this.finalTier = finalTier;

        this.consumesCoal = consumesCoal;
        this.consumesElectricity = consumesElectricity;

        this.maxCapacity = capacity;

        this.inventory.set(this.recipe.output, this.recipe.outputQuantity * this.maxCapacity);
    }

    // Calculates the cost of buying materials required for one recipe.
    get recipeCost(): number {
        let totalCost = 0;
        for (let input of this.recipe.inputs) {
            totalCost += this.expectedPrice(input[0]) * input[1];
        }
        return totalCost;
    }

    // A firm always tries to have a full stockpile, but nothing more.
    calculateProductionGoal(): number {
        return clamp(/*this.maxCapacity - this.inventory.get(this.recipe.output) / this.recipe.outputQuantity +*/
         this.productionOffset, 0, this.maxCapacity);
    }

    // At the beginning of each day, a firm tries to buy as many things as possible for them to fill their recipe.
    setBuyGoals(simulation: Simulation) {
        // Clear the previous buy goal.
        // Keep the keys for price considerations.
        for (let key of this.buyGoal.keys()) {
            this.buyGoal.set(key, 0);
        }

        // Don't buy anything unless the market can actually provide those goods.
        if (!Array.from(this.recipe.inputs.keys()).every((input) => simulation.markets.has(input))) {
            return;
        }

        let productionGoal = this.calculateProductionGoal();

        for (let input of this.recipe.inputs) {
            // Always buy to function at max capacity, but no need to buy extra if there are already stuff in the
            // inventory.
            // Round down on the purchase goal.
            // Try to make up for previous missed purchases AND buy new things for today.
            this.buyGoal.set(input[0], Math.floor(input[1] * productionGoal) - this.inventory.get(input[0]));
        }
    }

    placeBuyOrders(simulation: Simulation) {
        this.setBuyGoals(simulation);

        let totalExpectedCost = 0;
        for (let goal of this.buyGoal) {
            totalExpectedCost += this.expectedPrice(goal[0]) * goal[1];
        }
        if (totalExpectedCost == 0) {
            totalExpectedCost = 1;
        }

        for (let goal of this.buyGoal) {
            let priceWeight = this.expectedPrice(goal[0]) / totalExpectedCost;

            // Avoid selling with negative price.
            let buyOrder = new Order(this, goal[0], Math.max(this.inventory.money * priceWeight, 0));
            for (let i = 0; i < goal[1]; i++) {
                simulation.placeBuyOrder(buyOrder);
            }
        }
    }

    setSellGoals(simulation: Simulation) {
        // Clear the previous sell goal.
        this.sellGoal = new Map<Good, number>();

        // Try to sell all the outputs.
        // Round down to avoid decimal madness.
        this.sellGoal.set(this.recipe.output, Math.floor(this.inventory.get(this.recipe.output)));
    }

    consumeGoods(): void {
        this.lastProduction = 0;
        // Clear off anything leftover?
        /*
        for (let output of this.recipe.outputs) {
            this.inventory.set(output[0], 0);
        }*/
        // The firm tries to execute the recipe for as many times as possible.
        while (this.recipe.canApply(this.inventory) && this.lastProduction < this.maxCapacity) {
            this.recipe.apply(this.inventory);
            this.lastProduction++;
        }
    }

    // When a firm successfully sells something, it loses that item.
    onSuccessfulSale(good: Good): void {
        super.onSuccessfulSale(good);
        this.inventory.addGood(good, -1);
    }

    updatePriceExpectationsBasedOnGoals() {
        for (let goal of this.buyGoal) {
            // If the goal has not been met (cleared),
            if (goal[1] > 0) {
                // Try to raise the price next time.
                this.changeExpectedPrice(goal[0], Config.priceVolatilityFactor);
            } else {
                // If the goal has been cleared, try to lower the price for a better deal.
                // this.changeExpectedPrice(goal[0], -Config.priceVolatilityFactor);
            }
        }
        // If any goal was not met
        if (Array.from(this.buyGoal.values()).some((goal) => goal > 0)) {
            // Try to produce less to save money.
            // Failure puts more weight, because regret is a powerful emotion!
            this.productionOffset -= Config.productionGoalVolatility;
        } else {
            this.productionOffset += Config.productionGoalVolatility / 2;
        }

        for (let goal of this.sellGoal) {
            // If the goal has not been met (cleared),
            if (goal[1] > 0) {
                // Try to produce less to save money.
                // this.productionOffset -= Config.productionGoalVolatility / 2;
            } else {
                // If the goal has been cleared, try to make more next time!
                // this.productionOffset += Config.productionGoalVolatility / 2;
            }
        }

        // Avoid "stockpiling" production expectations.
        this.productionOffset = clamp(this.productionOffset, 10, this.maxCapacity);
    }

    // Firms pre-emptively gain money equal to demand for the item, and loses it at the end of the turn.
    borrowedMoney: number = 0;
    borrowMoneyFromDemand(simulation: Simulation) {
        this.borrowedMoney = 0;
        if (simulation.markets.has(this.recipe.output) && this.lastProduction == 0) {
            this.borrowedMoney = simulation.markets.get(this.recipe.output).buyOrders
                .map((order) => order.offerPrice)
                .reduce((a, b) => a + b, 0);

            this.inventory.money += this.borrowedMoney;
        }
    }

    returnMoneyFromDemand() {
        this.inventory.money -= this.borrowedMoney;
    }

    // Updates the firm's tier and recipe.
    setTier(tier: FirmTier) {
        this.tier = tier;

        this.recipe = this.baseRecipe.copy();
        for (let input of this.recipe.inputs) {
            if (Good.isLabour(input[0])) {
                this.recipe.inputs.set(input[0], input[1] / FirmTier.efficiencyMultiplier(tier));
            }
        }
        this.recipe.outputQuantity *= FirmTier.efficiencyMultiplier(tier);

        // If the factory is at industrial tier and consumes coal, then add it to the set of inputs.
        if (this.tier == FirmTier.Industrial && this.consumesCoal) {
            this.recipe.inputs.set(Good.Coal, FirmTier.efficiencyMultiplier(this.tier));
        }
        // If the factory is at advanced tier and consumes electricity, then add it to the set of inputs.
        if (this.tier == FirmTier.Advanced && this.consumesElectricity) {
            this.recipe.inputs.set(Good.Electricity, FirmTier.efficiencyMultiplier(this.tier));
        }
    }
}