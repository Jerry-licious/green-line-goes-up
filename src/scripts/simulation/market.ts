import {Order} from './order';
import {Config} from './configs';
import {Good} from './good';

export class Market {
    good: Good;
    buyOrders: Order[] = [];
    sellOrders: Order[] = [];

    currentExchangePrice: number;

    constructor(good: Good) {
        this.good = good;
    }

    placeBuyOrder(order: Order) {
        this.buyOrders.push(order);
    }
    placeSellOrder(order: Order) {
        this.sellOrders.push(order);
    }

    process() {
        // Sort from high to low for buyers.
        this.buyOrders.sort((a, b) => a.offerPrice - b.offerPrice);
        // And low to high for sellers.
        // Such that each buyer and seller will be matched with each other.
        this.sellOrders.sort((a, b) => b.offerPrice - a.offerPrice);

        // The amount of pairs can be made between buyers and sellers.
        let pairAmount = Math.min(this.buyOrders.length, this.sellOrders.length);

        let exchangePrices = [];

        for (let i = 0; i < pairAmount; i++) {
            let buyOrder = this.buyOrders[i], sellOrder = this.sellOrders[i];
            // If the buyer is willing to pay a price higher than the seller's price, a transaction happens.
            if (buyOrder.offerPrice >= sellOrder.offerPrice) {
                // TODO: Transaction

                // Assume that they split the difference.
                let exchangePrice = (buyOrder.offerPrice + sellOrder.offerPrice) / 2;
                // Buyer gets the thing and loses the money.
                buyOrder.source.inventory.incrementGood(buyOrder.good);
                buyOrder.source.inventory.money -= exchangePrice;
                // Seller gets the money.
                sellOrder.source.inventory.money += exchangePrice;
                // And get notified that their good got sold.
                sellOrder.source.onSuccessfulSale(this.good);

                // Track the exchange price.
                exchangePrices.push(exchangePrice);

                // A successful transaction updates the price for this good for both the buyer and the seller.
                // The buyer expects to be able to buy for cheaper.
                buyOrder.source.changeExpectedPrice(buyOrder.good, -Config.priceVolatilityFactor);
                // The seller expects to be able to sell for more.
                sellOrder.source.changeExpectedPrice(sellOrder.good, Config.priceVolatilityFactor);
            } else {
                // A failed transaction also updates the expected price, but in the opposite direction.
                // Both actors try to offer a better deal next time.
                buyOrder.source.changeExpectedPrice(buyOrder.good, Config.priceVolatilityFactor);
                sellOrder.source.changeExpectedPrice(sellOrder.good, -Config.priceVolatilityFactor);
            }
        }

        // If no people get paired, there will be a divide by 0 error.
        if (exchangePrices.length > 0) {
            this.currentExchangePrice = exchangePrices.reduce((sum, price) => sum + price, 0) / exchangePrices.length;
        } else {
            // If there are buyers, set the average exchange price to be equal to the highest buying price to attract
            // sellers.
            if (this.buyOrders.length > 0) {
                this.currentExchangePrice = this.buyOrders.reduce((previous, current) =>
                    previous.offerPrice > current.offerPrice ? previous : current).offerPrice;
            }
            // If there are sellers, set the market exchange price to be equal to the lowest selling price to
            // attract buyers.
            // This doesn't have to be an else-if, but the branching is here to show that only one of these are
            // supposed to happen when the pair amount is 0.
            else if (this.sellOrders.length > 0) {
                this.currentExchangePrice = this.sellOrders.reduce((previous, current) =>
                    previous.offerPrice > current.offerPrice ? previous : current).offerPrice;
            }
            // If for some reason this market has no buyers nor sellers, set the exchange price to the value of
            // money to attract some of both.
            else {
                this.currentExchangePrice = Config.baseMoneyValue;
            }
        }

        // Go through the unpaired buyers.
        for (let i = pairAmount; i < this.buyOrders.length; i++) {
            let buyOrder = this.buyOrders[i];
            // And increase their offer towards the average exchange price.
            buyOrder.source.changeExpectedPrice(buyOrder.good, Config.priceVolatilityFactor);
        }
        // Go through the unpaired sellers.
        for (let i = pairAmount; i < this.sellOrders.length; i++) {
            let sellOrder = this.sellOrders[i];
            sellOrder.source.changeExpectedPrice(sellOrder.good, -Config.priceVolatilityFactor);
        }

        // TODO: Keep some kind of record after a round of market exchange.
        this.buyOrders = [];
        this.sellOrders = [];
    }
}