import {EconomicActor} from './economic-actor';
import {Simulation} from '../simulation';
import {Good} from '../good';
import {Order} from '../order';
import {Config} from '../configs';
import {clamp} from '../../util/random';

export class Government extends EconomicActor {
    // The things that the government plans on ordering.
    orderGoal: Map<Good, number> = new Map<Good, number>();

    constructor() {
        super();

        // Initialise expected prices.
        for (let good of Good.values) {
            this.setExpectedPrice(good, Config.baseLabourValue);
        }
    }

    // Governments by themselves, does not have any goals.
    consumeGoods(): void {}
    setSellGoals(simulation: Simulation): void {}

    // Adds a good to the existing order goal.
    addOrderGoal(good: Good, amount: number) {
        if (this.orderGoal.has(good)) {
            this.orderGoal.set(good, this.orderGoal.get(good) + amount);
        } else {
            this.orderGoal.set(good, amount);
        }
    }

    // Set buy goals based on the order goals.
    setBuyGoals(simulation: Simulation): void {
        for (let goal of this.orderGoal) {
            // There's a maximum amount of things that the government may buy per cycle, this is to prevent blowing
            // up the economy with excessive spending.
            this.buyGoal.set(goal[0], clamp(goal[1], 0, Config.governmentBuyGoalIncrement));
        }
    }

    placeBuyOrders(simulation: Simulation) {
        this.setBuyGoals(simulation);

        let availableMoney = this.inventory.money;
        for (let goal of this.buyGoal) {
            let buyOrder = new Order(this, goal[0], this.expectedPrice(goal[0]));
            for (let i = 0; i < goal[1]; i++) {
                if (availableMoney > this.expectedPrice(goal[0])) {
                    simulation.placeBuyOrder(buyOrder);
                    availableMoney -= this.expectedPrice(goal[0]);
                } else {
                    // Move onto the next thing if we can't afford it.
                    this.buyGoal.set(goal[0], i);
                    break;
                }
            }
        }
    }

    onSuccessfulBuy(good: Good) {
        super.onSuccessfulBuy(good);
        // Also subtract from the order goal when something is bought.
        this.orderGoal.set(good, this.orderGoal.get(good) - 1);
    }
}