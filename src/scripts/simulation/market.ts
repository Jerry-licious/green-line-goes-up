import {Order} from './order';
import {Config} from './configs';
import {Good} from './good';

export class Market {
    good: Good;
    buyOrders: Order[] = [];
    sellOrders: Order[] = [];

    currentExchangePrice: number = Config.baseLabourValue;

    exchangeHistory: number[] = [];

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
        // Such that each buyer and seller will be matched with each other.
        this.buyOrders.sort((a, b) => b.offerPrice - a.offerPrice);
        // Randomise the order of the sellers to smooth income.
        this.sellOrders = this.sellOrders.map((order) => { return { order: order, value: Math.random() } })
            .sort((a, b) => a.value - b.value)
            .map((info) => info.order);

        // The amount of pairs can be made between buyers and sellers.
        let pairAmount = Math.min(this.buyOrders.length, this.sellOrders.length);

        let exchangePrices = [];

        for (let i = 0; i < pairAmount; i++) {
            let buyOrder = this.buyOrders[i], sellOrder = this.sellOrders[i];
            // If the buyer is willing to pay a price higher than the seller's price, a transaction happens.
            if (buyOrder.offerPrice >= sellOrder.offerPrice) {
                // TODO: Transaction

                // Assume that they don't split any differences and buyer just pays.
                let exchangePrice = buyOrder.offerPrice;
                // Buyer gets the thing and loses the money.
                buyOrder.source.inventory.addGood(buyOrder.good);
                buyOrder.source.inventory.money -= exchangePrice;
                // Seller gets the money.
                sellOrder.source.inventory.money += exchangePrice;

                // And get notified that their good got sold.
                sellOrder.source.onSuccessfulSale(this.good);
                buyOrder.source.onSuccessfulBuy(this.good);

                // Track the exchange price.
                exchangePrices.push(exchangePrice);
            }
        }

        this.exchangeHistory.push(exchangePrices.length);

        if (this.good == Good.Farming || this.good == Good.Crop || this.good == Good.Meat || this.good == Good.Fruit) {
            console.log(`${this.good} exchanged: ${exchangePrices.length}`);
            console.log(this.buyOrders.length, this.sellOrders.length);
        }

        // If there are both buyers and sellers.
        if (pairAmount > 0) {
            // If people are paired, the announced market price will be the average of their exchange prices.
            if (exchangePrices.length > 0) {
                this.currentExchangePrice = exchangePrices.reduce((sum, price) => sum + price, 0) / exchangePrices.length;
            } else {
                // If nobody gave good offers, the market price will be the average of the offer prices.
                this.currentExchangePrice =
                    (this.buyOrders.reduce((sum, order) => sum + order.offerPrice, 0) +
                    this.sellOrders.reduce((sum, order) => sum + order.offerPrice, 0)) /
                    (this.buyOrders.length + this.sellOrders.length);
            }
        } else {
            // If there are only buyers, set the average exchange price to be equal to the highest buying price to
            // attract sellers.
            if (this.buyOrders.length > 0) {
                this.currentExchangePrice = this.buyOrders.reduce((previous, current) =>
                    previous.offerPrice > current.offerPrice ? previous : current).offerPrice;
            }
            // If there are only sellers, set the market exchange price to be equal to the lowest selling price to
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
                this.currentExchangePrice = 0;
            }
        }

        // TODO: Keep some kind of record after a round of market exchange.
        this.buyOrders = [];
        this.sellOrders = [];
    }
}