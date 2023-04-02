// Model from which a firm can be built.
import {FirmTier} from '../firm-tier';
import {Recipe} from '../actors/recipe';
import {Basket} from '../basket';
import {Firm} from '../actors/firm';
import {Good} from '../good';

export class FirmBlueprint {
    firmID: string;
    // The initial tier of the firm.
    startingTier: FirmTier;
    // The highest upgrade level.
    finalTier: FirmTier;
    // The recipe it represents.
    recipe: Recipe;
    cost: Basket;
    consumesCoal: boolean;
    consumesElectricity: boolean;
    capacity: number;

    constructor({id, startingTier = FirmTier.Manual, finalTier = FirmTier.Advanced, recipe,
                    consumesCoal = false, consumesElectricity = true, cost, capacity = 250}: {
        id: string,
        startingTier?: FirmTier,
        finalTier?: FirmTier,
        recipe: Recipe,
        consumesCoal?: boolean,
        consumesElectricity?: boolean,
        cost: Basket,
        capacity?: number
    }) {
        this.firmID = id;
        this.startingTier = startingTier;
        this.finalTier = finalTier;
        this.recipe = recipe;
        this.consumesCoal = consumesCoal;
        this.consumesElectricity = consumesElectricity;
        this.cost = cost;
        this.capacity = capacity;
    }

    createFirm(): Firm {
        return new Firm(this.firmID, this.recipe.copy(), this.startingTier, this.finalTier, this.consumesCoal,
            this.consumesElectricity, this.capacity);
    }

    static mineSetupCost: Basket = Basket.withItems(new Map(
        [[Good.Mining, 1000]]
    ));
    static farmSetupCost: Basket = Basket.withItems(new Map(
        [[Good.Farming, 1000], [Good.Crop, 1000], [Good.Wood, 1000]]
    ));
    // The cost to create a manual tier firm.
    static workshopSetupCost: Basket = Basket.withItems(new Map<Good, number>(
        [[Good.Assembly, 1000], [Good.Wood, 1000]]
    ));
    // The cost to create a basic tier firm.
    static basicSetupCost: Basket = Basket.withItems(new Map<Good, number>(
        [[Good.BasicEquipment, 250], [Good.Assembly, 1000], [Good.Wood, 1000], [Good.Rocks, 1000]]
    ));
    // The cost to create an industrial tier firm.
    static factorySetupCost: Basket = Basket.withItems(new Map<Good, number>(
        [[Good.IndustrialEquipment, 250], [Good.Assembly, 1000], [Good.Wood, 2000], [Good.Rocks, 2000]]
    ));
    // The cost to create an industrial tier firm.
    static advancedFactorySetupCost: Basket = Basket.withItems(new Map<Good, number>(
        [[Good.AdvancedEquipment, 250], [Good.Assembly, 1000], [Good.Wood, 3000], [Good.Rocks, 3000]]
    ));

    static blueprints: FirmBlueprint[] = [
        // Buildable resource sites.
        new FirmBlueprint({
            id: "coal_mine",
            recipe: new Recipe(
                new Map([[Good.Mining, 1]]), Good.Coal, 5
            ),
            cost: FirmBlueprint.mineSetupCost
        }),
        new FirmBlueprint({
            id: "mine",
            recipe: new Recipe(
                new Map([[Good.Mining, 1]]), Good.Mineral, 5
            ),
            cost: FirmBlueprint.mineSetupCost
        }),
        new FirmBlueprint({
            id: "gold_mine",
            recipe: new Recipe(
                new Map([[Good.Mining, 1]]), Good.PreciousMetal, 3
            ),
            cost: FirmBlueprint.mineSetupCost
        }),
        new FirmBlueprint({
            id: "oil_field",
            recipe: new Recipe(
                new Map([[Good.Mining, 1]]), Good.Oil, 4
            ),
            cost: FirmBlueprint.mineSetupCost
        }),
        new FirmBlueprint({
            id: "wool_farm",
            recipe: new Recipe(
                new Map([[Good.Farming, 1], [Good.Crop, 1]]), Good.Wool, 2
            ),
            cost: FirmBlueprint.farmSetupCost
        }),
        new FirmBlueprint({
            id: "dairy_farm",
            recipe: new Recipe(
                new Map([[Good.Farming, 1], [Good.Crop, 1]]), Good.Milk, 1
            ),
            cost: FirmBlueprint.farmSetupCost
        }),
        new FirmBlueprint({
            id: "forest",
            recipe: new Recipe(
                new Map([[Good.Forestry, 1]]), Good.Wood, 5
            ),
            cost: FirmBlueprint.farmSetupCost
        }),
        // Heavy industry
        new FirmBlueprint({
            id: "equipment_workshop",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.ProcessedWood, 5], [Good.Rocks, 5]]),
                Good.BasicEquipment, 1
            ),
            cost: FirmBlueprint.workshopSetupCost
        }),
        new FirmBlueprint({
            id: "equipment_factory",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.BasicEquipment, 1], [Good.MachineParts, 5]]),
                Good.IndustrialEquipment, 1
            ),
            startingTier: FirmTier.Basic,
            cost: FirmBlueprint.basicSetupCost
        }),
        new FirmBlueprint({
            id: "machine_factory",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.IndustrialEquipment, 1], [Good.Circuit, 1], [Good.Motor, 1]]),
                Good.AdvancedEquipment, 1
            ),
            startingTier: FirmTier.Industrial,
            cost: FirmBlueprint.factorySetupCost
        }),
        // Power Plants
        new FirmBlueprint({
            id: "coal_plant",
            recipe: new Recipe(
                // Coal roughly outputs 10 times the amount of electricity when put into a power plant.
                new Map([[Good.Assembly, 1], [Good.Coal, 10]]),
                Good.Electricity, 50
            ),
            startingTier: FirmTier.Basic,
            cost: FirmBlueprint.basicSetupCost
        }),
        new FirmBlueprint({
            id: "wind_plant",
            recipe: new Recipe(
                // Power plants are more cost-efficient with maintenance.
                new Map([[Good.Technical, 1]]),
                Good.Electricity, 80
            ),
            startingTier: FirmTier.Industrial,
            cost: FirmBlueprint.factorySetupCost,
            capacity: 50
        }),
        new FirmBlueprint({
            id: "solar_plant",
            recipe: new Recipe(
                // Power plants are more cost-efficient with maintenance.
                new Map([[Good.Technical, 1]]),
                Good.Electricity, 80
            ),
            startingTier: FirmTier.Advanced,
            cost: FirmBlueprint.advancedFactorySetupCost,
            capacity: 50
        }),
        // Intermediate products
        new FirmBlueprint({
            id: "carpentry",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.Wood, 5]]),
                Good.ProcessedWood, 5
            ),
            cost: FirmBlueprint.workshopSetupCost
        }),
        new FirmBlueprint({
            id: "chemical_plant",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.Oil, 4]]),
                Good.Chemicals, 4
            ),
            startingTier: FirmTier.Industrial,
            cost: FirmBlueprint.factorySetupCost
        }),
        new FirmBlueprint({
            id: "forge",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.Mineral, 5], [Good.Coal, 1]]),
                Good.Metal, 5
            ),
            startingTier: FirmTier.Basic,
            cost: FirmBlueprint.basicSetupCost
        }),
        new FirmBlueprint({
            id: "advanced_forge",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.PreciousMineral, 3], [Good.Coal, 1]]),
                Good.PreciousMetal, 3
            ),
            startingTier: FirmTier.Industrial,
            cost: FirmBlueprint.factorySetupCost
        }),
        new FirmBlueprint({
            id: "motor_factory",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.MachineParts, 1], [Good.PreciousMetal, 1]]),
                Good.Motor, 2
            ),
            startingTier: FirmTier.Industrial,
            cost: FirmBlueprint.factorySetupCost
        }),
        new FirmBlueprint({
            id: "circuits_factory",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.Metal, 1], [Good.PreciousMetal, 1], [Good.Chemicals, 1]]),
                Good.Circuit, 1
            ),
            startingTier: FirmTier.Industrial,
            cost: FirmBlueprint.factorySetupCost
        }),
        new FirmBlueprint({
            id: "machine_parts_factory",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.Metal, 3]]),
                Good.MachineParts, 5
            ),
            startingTier: FirmTier.Industrial,
            cost: FirmBlueprint.factorySetupCost
        }),
        new FirmBlueprint({
            id: "textile_factory",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.Wool, 2]]),
                Good.Textile, 2
            ),
            startingTier: FirmTier.Basic,
            cost: FirmBlueprint.basicSetupCost
        }),
        new FirmBlueprint({
            id: "flour_mill",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.Crop, 3]]),
                Good.Flour, 3
            ),
            startingTier: FirmTier.Basic,
            cost: FirmBlueprint.basicSetupCost
        }),
        // Consumer goods factories.
        new FirmBlueprint({
            id: "clothes_factory",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.Textile, 2]]),
                Good.Clothes, 2
            ),
            startingTier: FirmTier.Basic,
            cost: FirmBlueprint.basicSetupCost
        }),
        new FirmBlueprint({
            id: "meat_processing_plant",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.Meat, 1], [Good.Chemicals, 1]]),
                Good.ProcessedMeat, 3
            ),
            startingTier: FirmTier.Industrial,
            cost: FirmBlueprint.factorySetupCost
        }),
        new FirmBlueprint({
            id: "crop_processing_plant",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.Crop, 1], [Good.Chemicals, 1]]),
                Good.ProcessedVegetables, 3
            ),
            startingTier: FirmTier.Industrial,
            cost: FirmBlueprint.factorySetupCost
        }),
        new FirmBlueprint({
            id: "dairy_factory",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.Milk, 1]]),
                Good.Dairy, 3
            ),
            startingTier: FirmTier.Manual,
            cost: FirmBlueprint.workshopSetupCost
        }),
        new FirmBlueprint({
            id: "bakery",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.Flour, 1]]),
                Good.Baked, 2
            ),
            startingTier: FirmTier.Manual,
            cost: FirmBlueprint.workshopSetupCost
        }),
        new FirmBlueprint({
            id: "restaurant",
            recipe: new Recipe(
                new Map([[Good.Artisan, 1], [Good.Meat, 1], [Good.Crop, 1]]),
                Good.LuxuryFood, 1
            ),
            startingTier: FirmTier.Manual,
            finalTier: FirmTier.Manual,
            cost: FirmBlueprint.workshopSetupCost
        }),
        new FirmBlueprint({
            id: "furniture_factory",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.ProcessedWood, 1]]),
                Good.Furniture, 1
            ),
            finalTier: FirmTier.Basic,
            cost: FirmBlueprint.basicSetupCost
        }),
        new FirmBlueprint({
            id: "luxury_furniture_workshop",
            recipe: new Recipe(
                new Map([[Good.Artisan, 1], [Good.ProcessedWood, 1], [Good.PreciousMetal, 1]]),
                Good.LuxuryFurniture, 1
            ),
            startingTier: FirmTier.Manual,
            finalTier: FirmTier.Manual,
            cost: FirmBlueprint.workshopSetupCost
        }),
        new FirmBlueprint({
            id: "appliance_factory",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.MachineParts, 2]]),
                Good.Appliance, 1
            ),
            startingTier: FirmTier.Industrial,
            cost: FirmBlueprint.factorySetupCost
        }),
        new FirmBlueprint({
            id: "smart_appliance_factory",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.Appliance, 1], [Good.Circuit, 1]]),
                Good.SmartAppliance, 1
            ),
            startingTier: FirmTier.Advanced,
            cost: FirmBlueprint.advancedFactorySetupCost
        }),
        new FirmBlueprint({
            id: "electronics_factory",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.Circuit, 2]]),
                Good.Electronics, 1
            ),
            startingTier: FirmTier.Advanced,
            cost: FirmBlueprint.advancedFactorySetupCost
        }),
        new FirmBlueprint({
            id: "automobile_factory",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.Circuit, 2], [Good.MachineParts, 2], [Good.Motor, 2]]),
                Good.Automobiles, 1
            ),
            startingTier: FirmTier.Advanced,
            cost: FirmBlueprint.advancedFactorySetupCost
        }),
    ]
}