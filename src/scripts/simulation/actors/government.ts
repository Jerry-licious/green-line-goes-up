import {EconomicActor} from './economic-actor';
import {Simulation} from '../simulation';
import {Good} from '../good';

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
}