import {Actor} from './actor';
import {Good} from './good';
import {Market} from './market';
import {Config} from './configs';
import {Order} from './order';


export class Simulation {
    // All individual actors in the simulation.
    actors: Actor[] = [];
    // All markets in the simulation, starts off empty and opens up as people place buy and sell orders.
    markets: Map<Good, Market> = new Map<Good, Market>();

    constructor() {
        // Populate the world with actors.
        for (let i = 0; i < Config.actorAmount; i++) {
            this.actors.push(new Actor());
        }
    }

    // A list of goods exchanged on the market.
    get goodsSold(): Good[] {
        return Array.from(this.markets.keys());
    }

    // Allows actors to place buy and sell orders on the market.
    placeBuyOrder(order: Order) {
        // It only makes sense to place orders when there's actually a market for it.
        // Don't worry, each actor will make sure that there is a market before wanting to buy things.
        if (this.markets.has(order.good)) {
            this.markets.get(order.good).placeBuyOrder(order);
        } else {
            // This is not supposed to happen.
            console.error(`Misplaced buy order on ${order.good}.`);
        }
    }
    placeSellOrder(order: Order) {
        // If there's already a market for this good, place the order on the market.
        if (this.markets.has(order.good)) {
            this.markets.get(order.good).placeSellOrder(order);
        } else {
            // If there isn't a market, open it up when someone wants to sell a new good.
            let newMarket = new Market(order.good);
            newMarket.placeSellOrder(order);
            this.markets.set(order.good, newMarket);
        }
    }

    // Runs one tick of the simulation.
    tick() {
        // At the beginning of each day, each actor places sell orders on their goods.
        for (let actor of this.actors) {
            actor.placeSellOrders(this);
        }

        // Then, with the money they earned from the previous day (or the ones they started with), they buy things
        // from the market.
        for (let actor of this.actors) {
            actor.placeBuyOrders(this);
        }

        // Each market then makes the transactions, updating price expectations and so on.
        for (let market of this.markets.values()) {
            market.process();
        }

        // Using the order placement system, actors will only act on their expected price and will not inform of the
        // market if they would like to buy more for cheaper, or sell more for more money.
        // With actors only updating their perception of price on the market, other people will be unnoticed even
        // when the price becomes more favourable.
        // To counteract this, gossip will occur at the end of each market day, where everyone will be noticed of its
        // price.
        // As a result, all actors update their perception of price, but actors who participate in the market are
        // more influenced.
        for (let market of this.markets.values()) {
            for (let actor of this.actors) {
                actor.changeExpectedPrice(market.good,
                    Math.sign(market.currentExchangePrice - actor.expectedPrice(market.good)) * Config.priceVolatilityFactor);
            }
        }

        // When each day finishes, the actors consume their goods.
        for (let actor of this.actors) {
            actor.consumeGoods();
        }
    }
}