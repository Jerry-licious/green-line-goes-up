export namespace Config {
    // The base utility of each good for each actor will be multiplied by a random number, whose mean will be 1 and
    // whose SD will be equal to this.
    // Allows different actors to like different things.
    export const personalUtilityMultiplierStandardDeviation = 0.25;
    // How much a person initially values each unit of their labour. This kick-starts the market and will adjust later.
    export const baseLabourValue = 10.0;
    // How much a person values a unit of money.
    export const baseMoneyValue = 5.0;

    // The base units of labour each person can output at the start of each day.
    export const baseLabourOutput = 5.0;
    // The base productivity of each actor will be multiplied by a random number, whose mean will be 1 and whose SD will
    // be equal to this.
    // Allows different actors to produce differently.
    export const labourOutputUtilityMultiplierStandardDeviation = 0.3;


    // The rate at which prices converge.
    export const priceVolatilityFactor = 0.1;
    // The flat expected price change when a person does not get paired. This allows them to raise higher/lower
    // prices than the market price to drive price changes.
    export const unpairedPriceVolatility = 0.2;

    // The number of actors in a given simulation.
    export const actorAmount = 100;

    // The amount of money that starts off in each actor's pocket.
    export const initialMoneyPerActor = 100;

    // The factor by which actors specialise in their respective labour tasks by getting better after successfully
    // selling their labour.
    export const specialisationFactor = 0.1;

    // Floor to prevent "overflowing" expected prices into the negatives.
    export const lowestPossiblePrice = 1.0;
}
