import {EconomicActor} from './economic-actor';
import {Simulation} from '../simulation';
import {Good} from '../good';
import {Order} from '../order';

export class Government extends EconomicActor {
    // Governments by themselves, does not have any goals.
    consumeGoods(): void {}
    setBuyGoals(simulation: Simulation): void {}
    setSellGoals(simulation: Simulation): void {}

    addBuyGoal(good: Good, amount: number) {
        if (this.buyGoal.has(good)) {
            this.buyGoal.set(good, this.buyGoal.get(good) + amount);
        } else {
            this.buyGoal.set(good, amount);
        }
    }

    placeBuyOrders(simulation: Simulation) {
        let availableMoney = this.inventory.money;
        for (let goal of this.buyGoal) {
            let buyOrder = new Order(this, goal[0], this.expectedPrice(goal[0]));
            for (let i = 0; i < goal[1]; i++) {
                if (availableMoney > this.expectedPrice(goal[0])) {
                    simulation.placeBuyOrder(buyOrder);
                    availableMoney -= this.expectedPrice(goal[0]);
                } else {
                    // Move onto the next thing if we can't afford it.
                    break;
                }
            }
        }
    }
}