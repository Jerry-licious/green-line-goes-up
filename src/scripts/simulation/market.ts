import {Order} from './order';

// The rate at which prices converge.
const priceVolatilityFactor = 0.2;
// The flat expected price change when a person does not get paired.
const unpairedPriceVolatility = 0.2;

export class Market {
    process(buyOrders: Order[], sellOrders: Order[]) {
        // Sort from high to low for buyers.
        buyOrders.sort((a, b) => a.expectedPrice - b.expectedPrice);
        // And low to high for sellers.
        // Such that each buyer and seller will be matched with each other.
        sellOrders.sort((a, b) => b.expectedPrice - a.expectedPrice);

        // The amount of pairs can be made between buyers and sellers.
        let pairAmount = Math.min(buyOrders.length, sellOrders.length);

        let exchangePrices = [];

        for (let i = 0; i < pairAmount; i++) {
            let buyOrder = buyOrders[i], sellOrder = sellOrders[i];
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
        for (let i = pairAmount; i < buyOrders.length; i++) {
            let buyOrder = buyOrders[i];
            // And increase their offer towards the average exchange price.
            buyOrder.source.changeExpectedPrice(buyOrder.good,
                (averageExchangePrice - buyOrder.expectedPrice) * priceVolatilityFactor + unpairedPriceVolatility);
        }
        for (let i = pairAmount; i < sellOrders.length; i++) {
            let sellOrder = sellOrders[i];
            sellOrder.source.changeExpectedPrice(sellOrder.good,
                (averageExchangePrice - sellOrder.expectedPrice) * priceVolatilityFactor - unpairedPriceVolatility);
        }
    }
}