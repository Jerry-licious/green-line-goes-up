export namespace Config {
    // The base utility of each good for each actor will be multiplied by a random number, whose mean will be 1 and
    // whose SD will be equal to this.
    // Allows different actors to like different things.
    export const personalUtilityMultiplierStandardDeviation = 0.25;
    // How much a person initially values each unit of their labour. This kick-starts the market and will adjust later.
    export const baseLabourValue = 10.0;
    // How much a person values a unit of money.
    export const baseMoneyValue = 1.0;

    // The base units of labour each person can output at the start of each day.
    export const baseLabourOutput = 5.0;
    // The base productivity of each actor will be multiplied by a random number, whose mean will be 1 and whose SD will
    // be equal to this.
    // Allows different actors to produce differently.
    export const labourOutputUtilityMultiplierStandardDeviation = 0.1;


    // The rate at which prices converge.
    export const priceVolatilityFactor = 0.2;
    // The effect of gossipping on the expected prices.
    export const gossipInfluence = 0.1;

    // The number of actors in a given simulation.
    export const actorAmount = 100;

    // The amount of money that starts off in each individual's pocket.
    export const initialMoneyPerIndividual = 100;
    // The amount of money that starts off in each firm's pocket.
    export const initialMoneyPerFirm = 0;

    // The factor by which actors specialise in their respective labour tasks by getting better after successfully
    // selling their labour.
    export const specialisationFactor = 0.1;

    // Floor to prevent "overflowing" expected prices into the negatives.
    export const lowestPossiblePrice = 0.01;

    // The amount that the production goal gets changed by upon successful or unsuccessful sale.
    export const productionGoalVolatility = 5;

    // The number of days for which the firm remembers its sales records.
    export const firmTrackDays = 5;

    // Every tier of upgrade increases the amount of product produced, and reduces the amount of labour consumed.
    export const upgradeMultiplier = 1.64;

    export const dataMemory = 300;

    export const graphConfigs = {
        showPoint: false,
        lineSmooth: false,
        axisX: {
            showGrid: false
        }
    }

    export const governmentIncomeModifier = 0.2;
    // The most amount of one type of good the government may buy in a given cycle.
    export const governmentBuyGoalIncrement = 30;
}
