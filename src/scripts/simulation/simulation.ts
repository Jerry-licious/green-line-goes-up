import {Good} from './good';
import {Market} from './market';
import {Config} from './configs';
import {Order} from './order';
import {Individual} from './actors/individual';
import {Firm} from './actors/firm';
import {EconomicActor} from './actors/economic-actor';
import {Recipe} from './actors/recipe';
import {FirmTier} from './firm-tier';
import {Widget} from '../widget/widgets/widget';
import {Government} from './actors/government';


export class Simulation extends Widget<number>{
    government: Government = new Government();

    // All individual actors in the simulation.
    individuals: Individual[] = [];
    resources: Firm[] = [];
    factories: Firm[] = [];

    // All markets in the simulation, starts off empty and opens up as people place buy and sell orders.
    markets: Map<Good, Market> = new Map<Good, Market>();

    timeElapsed: number = 0;

    currentRealGDP: number = 0;
    realGDPHistory: number[] = [];

    labourFactor = 1;
    resourcesFactor = 0;
    physicalCapitalFactor = 0;
    humanCapitalFactor = 0;
    technologyFactor = 0;

    constructor() {
        super('div');

        // Populate the world with actors.
        for (let i = 0; i < Config.actorAmount; i++) {
            this.individuals.push(new Individual());
        }


        this.resources.push(new Firm("Crop Farm", new Recipe(
            new Map([[Good.Farming, 1]]), Good.Crop,  5
        ), FirmTier.Manual, FirmTier.Advanced, false, false, 250));
        this.resources.push(new Firm("Meat Farm", new Recipe(
            new Map([[Good.Crop, 1], [Good.Farming, 1]]), Good.Meat, 1
        ), FirmTier.Manual, FirmTier.Advanced, false, false, 250));
    }

    // A list of goods exchanged on the market.
    get goodsSold(): Good[] {
        return Array.from(this.markets.keys());
    }

    // Returns the list of *all* actors.
    getAllActors(): EconomicActor[] {
        return [].concat(this.individuals).concat(this.resources).concat(this.factories);
    }
    // Returns just firms.
    getAllFirms(): Firm[] {
        return [].concat(this.resources).concat(this.factories);
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
        let actors = this.getAllActors();
        for (let actor of this.individuals) {
            // """Communism"""
            // actor.inventory.money = Config.initialMoneyPerIndividual;
            actor.placeBuyOrders(this);
        }
        this.government.placeBuyOrders(this);

        for (let actor of this.getAllFirms()) {
            // Then, with the money they earned from the previous day (or the ones they started with), they buy things
            // from the market.
            actor.placeBuyOrders(this);
        }

        for (let actor of actors) {
            // At the beginning of each day, each actor places sell orders on their goods.
            actor.placeSellOrders(this);
        }


        // Each market then makes the transactions, updating price expectations and so on.
        for (let market of this.markets.values()) {
            market.process();
        }

        this.recordGDP();
        this.awardMoney();
        this.determineFactorsOfProduction();

        // When each day finishes, the actors consume their goods.
        for (let actor of actors) {
            actor.updatePriceExpectationsBasedOnGoals();
            actor.consumeGoods();
        }
        this.government.updatePriceExpectationsBasedOnGoals();

        this.gossip();

        this.timeElapsed++;
    }

    recordGDP() {
        this.currentRealGDP = this.individuals.map((individual) => individual.calculateInventoryValue())
            .reduce((a, b) => a + b, 0);

        this.realGDPHistory.push(this.currentRealGDP);
        if (this.realGDPHistory.length > Config.dataMemory) {
            this.realGDPHistory.shift();
        }
    }

    awardMoney() {
        this.government.inventory.money += this.currentRealGDP / Config.actorAmount * Config.governmentIncomeModifier;
    }

    determineFactorsOfProduction() {
        // Labour is constant.
        this.labourFactor = 1;

        // 11 is the total amount of resource sites.
        this.resourcesFactor = this.resources.length / 11;

        // 152 is the total possible amount of firms and upgrades.
        this.physicalCapitalFactor = this.getAllFirms().map((firm) => FirmTier.tier(firm.tier) + 1)
            .reduce((a, b) => a + b, 0) / 152;

        this.humanCapitalFactor = Math.min(1, this.individuals
            .map((individual) => individual.productivity.get(individual.mostProductiveLabour) - Config.baseLabourOutput)
            .reduce((a, b) => a + b, 0) / (Config.actorAmount * Config.baseLabourOutput));

        this.technologyFactor = FirmTier.tier(Array.from(this.markets.keys())
            .map((good) => Good.getTier(good))
            .reduce((a, b) => FirmTier.tier(a) > FirmTier.tier(b) ? a : b, FirmTier.Manual)) / 3;
    }

    gossip() {
        // Using the order placement system, actors will only act on their expected price and will not inform of the
        // market if they would like to buy more for cheaper, or sell more for more money.
        // With actors only updating their perception of price on the market, other people will be unnoticed even
        // when the price becomes more favourable.
        // To counteract this, gossip will occur at the end of each market day, where everyone will be noticed of its
        // price.
        // As a result, all actors update their perception of price, but actors who participate in the market are
        // more influenced.
        for (let market of this.markets.values()) {
            for (let actor of this.individuals) {
                if (Good.isLabour(market.good)) {
                    actor.changeExpectedPrice(market.good,
                        Math.sign(market.currentExchangePrice - actor.expectedPrice(market.good)) * Config.gossipInfluence * 2);
                } else {
                    actor.changeExpectedPrice(market.good,
                        Math.sign(market.currentExchangePrice - actor.expectedPrice(market.good)) * Config.gossipInfluence);
                }
            }
            // Firms take stronger influence from the market price, but only for labour. This makes them price
            // takers of labour rather than price setters.
            /*
            for (let actor of this.getAllFirms()) {
                actor.changeExpectedPrice(market.good,
                    Math.sign(market.currentExchangePrice - actor.expectedPrice(market.good)) *
                     Config.gossipInfluence);
            }*/
            this.government.changeExpectedPrice(market.good,
                Math.sign(market.currentExchangePrice - this.government.expectedPrice(market.good)) * Config.gossipInfluence);
        }
    }

    updateElement(state?: any): void {
        throw new Error("Method not implemented.");
    }
}