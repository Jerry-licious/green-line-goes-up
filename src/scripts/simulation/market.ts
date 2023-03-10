import {Order} from './order';

// The rate at which prices converge.
const priceVolatilityFactor = 0.2;
// The flat expected price change when a person does not get paired.
const unpairedPriceVolatility = 0.2;

export class Market {
    buyOrders: Order[] = [];
    sellOrders: Order[] = [];

    process() {
        // Sort from high to low for buyers.
        this.buyOrders.sort((a, b) => a.expectedPrice - b.expectedPrice);
        // And low to high for sellers.
        // Such that each buyer and seller will be matched with each other.
        this.sellOrders.sort((a, b) => b.expectedPrice - a.expectedPrice);

        // The amount of pairs can be made between buyers and sellers.
        let pairAmount = Math.min(this.buyOrders.length, this.sellOrders.length);

        let exchangePrices = [];

        for (let i = 0; i < pairAmount; i++) {
            let buyOrder = this.buyOrders[i], sellOrder = this.sellOrders[i];
            // If the buyer is willing to pay a price higher than the seller's price, a transaction happens.
            let priceChange = Math.abs(buyOrder.expectedPrice - sellOrder.expectedPrice) * priceVolatilityFactor;
            if (buyOrder.expectedPrice >= sellOrder.expectedPrice) {
                // TODO: Transaction
                // Assume that they split the difference.
                exchangePrices.push((buyOrder.expectedPrice + sellOrder.expectedPrice) / 2);
                // A successful transaction updates the price for this good for both the buyer and the seller.
                // The buyer expects to be able to buy for cheaper.
                buyOrder.source.changeExpectedPrice(buyOrder.good, -priceChange);
                // The seller expects to be able to sell for more.
                sellOrder.source.changeExpectedPrice(sellOrder.good, priceChange);
            } else {
                // A failed transaction also updates the expected price, but in the opposite direction.
                // Both actors try to offer a better deal next time.
                buyOrder.source.changeExpectedPrice(buyOrder.good, priceChange);
                sellOrder.source.changeExpectedPrice(sellOrder.good, -priceChange);
            }
        }

        let averageExchangePrice = exchangePrices.reduce((sum, price) => sum + price) / pairAmount;

        // Go through the unpaired buyers.
        for (let i = pairAmount; i < this.buyOrders.length; i++) {
            let buyOrder = this.buyOrders[i];
            // And increase their offer towards the average exchange price.
            buyOrder.source.changeExpectedPrice(buyOrder.good,
                (averageExchangePrice - buyOrder.expectedPrice) * priceVolatilityFactor + unpairedPriceVolatility);
        }
        // Go through the unpaired sellers.
        for (let i = pairAmount; i < this.sellOrders.length; i++) {
            let sellOrder = this.sellOrders[i];
            sellOrder.source.changeExpectedPrice(sellOrder.good,
                (averageExchangePrice - sellOrder.expectedPrice) * priceVolatilityFactor - unpairedPriceVolatility);
        }

        // TODO: Keep some kind of record after a round of market exchange.
        this.buyOrders = [];
        this.sellOrders = [];
    }
}