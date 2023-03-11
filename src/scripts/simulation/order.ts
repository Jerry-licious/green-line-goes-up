import {EconomicActor} from './actors/economic-actor';
import {Good} from './good';

// Actors may buy and sell items on the market by placing buy and sell orders on the market, instead of showing up
// by themselves.
// This is advantageous because in a round based approach it allows each actor to place multiple orders at different
// expected prices.
export class Order {
    source: EconomicActor;

    good: Good;
    // The price that the actor expects the market to have.
    offerPrice: number;

    constructor(source: EconomicActor, good: Good, expectedPrice: number) {
        this.source = source;
        this.good = good;
        this.offerPrice = expectedPrice;
    }
}