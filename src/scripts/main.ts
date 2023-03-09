import {Actor} from './simulation/actor';
import {Good} from './simulation/good';

console.log(Good.values.length);

let sellers: Actor[] = [];
let buyers: Actor[] = [];

let beliefVolatility: number = 0.6

for (let i = 0; i < 10; i++) {
    sellers.push(new Actor());
    buyers.push(new Actor());
}


function tick() {
    // Sort the buyers and sellers to allow the maximum number of transactions.
    // Ascending for sellers.
    sellers.sort((a, b) => b.expectedMarketPrice - a.expectedMarketPrice);
    // Descending for buyers.
    buyers.sort((a, b) => a.expectedMarketPrice - b.expectedMarketPrice);
    for (let i = 0; i < sellers.length; i++) {
        let buyer = buyers[i];
        let seller = sellers[i];
        let beliefChange = Math.abs(buyer.expectedMarketPrice - seller.expectedMarketPrice) * beliefVolatility;
        // If the buyer offers a higher price than the seller.
        if (buyer.expectedMarketPrice >= seller.expectedMarketPrice) {
            // Transaction succeeds.
            // Buyer considers paying less next time, seller considers charging more next time.
            buyer.expectedMarketPrice -= beliefChange;
            seller.expectedMarketPrice += beliefChange;
        } else {
            buyer.expectedMarketPrice += beliefChange;
            seller.expectedMarketPrice -= beliefChange;
        }
    }
    console.log("Round complete:");
    console.log(buyers.map((buyer) => buyer.expectedMarketPrice));
    console.log(sellers.map((seller) => seller.expectedMarketPrice));
}

for (let i = 0; i < 10; i++) {
    tick();
}