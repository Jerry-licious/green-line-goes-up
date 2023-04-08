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
    convertToAssembly: boolean;
    capacity: number;

    constructor({id, startingTier = FirmTier.Manual, finalTier = FirmTier.Advanced, recipe,
                    consumesCoal = false, consumesElectricity = true, convertToAssembly = true,
                    cost, capacity = 250}: {
        id: string,
        startingTier?: FirmTier,
        finalTier?: FirmTier,
        recipe: Recipe,
        consumesCoal?: boolean,
        consumesElectricity?: boolean,
        convertToAssembly?: boolean,
        cost: Basket,
        capacity?: number
    }) {
        this.firmID = id;
        this.startingTier = startingTier;
        this.finalTier = finalTier;
        this.recipe = recipe;
        this.consumesCoal = consumesCoal;
        this.consumesElectricity = consumesElectricity;
        this.convertToAssembly = convertToAssembly;
        this.cost = cost;
        this.capacity = capacity;
    }

    createFirm(): Firm {
        return new Firm(this.firmID, this.recipe.copy(), this.startingTier, this.finalTier, this.consumesCoal,
            this.consumesElectricity, this.convertToAssembly, this.capacity);
    }

    static mineSetupCost: Basket = Basket.withItems(new Map(
        [[Good.Mining, 100]]
    ));
    static farmSetupCost: Basket = Basket.withItems(new Map(
        [[Good.Farming, 100], [Good.Crop, 100], [Good.Wood, 100]]
    ));
    static forestSetupCost: Basket = Basket.withItems(new Map(
        [[Good.Forestry, 100]]
    ));
    // The cost to create a manual tier firm.
    static workshopSetupCost: Basket = Basket.withItems(new Map<Good, number>(
        [[Good.Assembly, 100], [Good.Wood, 100]]
    ));
    // The cost to create a basic tier firm.
    static basicSetupCost: Basket = Basket.withItems(new Map<Good, number>(
        [[Good.BasicEquipment, 250], [Good.Assembly, 100], [Good.Wood, 100]]
    ));
    // The cost to create an industrial tier firm.
    static factorySetupCost: Basket = Basket.withItems(new Map<Good, number>(
        [[Good.IndustrialEquipment, 250], [Good.Assembly, 100], [Good.Wood, 200]]
    ));
    // The cost to create an industrial tier firm.
    static advancedFactorySetupCost: Basket = Basket.withItems(new Map<Good, number>(
        [[Good.AdvancedEquipment, 250], [Good.Assembly, 100], [Good.Wood, 300]]
    ));

    static resourcesBlueprints: FirmBlueprint[] = [
        // Buildable resource sites.
        new FirmBlueprint({
            id: "Coal Mine",
            recipe: new Recipe(
                new Map([[Good.Mining, 1]]), Good.Coal, 5
            ),
            // Mines require mining labour to the very end.
            convertToAssembly: false,
            cost: FirmBlueprint.mineSetupCost
        }),
        new FirmBlueprint({
            id: "Mine",
            recipe: new Recipe(
                new Map([[Good.Mining, 1]]), Good.Mineral, 5
            ),
            // Mines require mining labour to the very end.
            convertToAssembly: false,
            cost: FirmBlueprint.mineSetupCost
        }),
        new FirmBlueprint({
            id: "Gold Mine",
            recipe: new Recipe(
                new Map([[Good.Mining, 1]]), Good.PreciousMetal, 3
            ),
            // Mines require mining labour to the very end.
            convertToAssembly: false,
            cost: FirmBlueprint.mineSetupCost
        }),
        new FirmBlueprint({
            id: "Oil Field",
            recipe: new Recipe(
                new Map([[Good.Mining, 1]]), Good.Oil, 4
            ),
            // Mines require mining labour to the very end.
            convertToAssembly: false,
            cost: FirmBlueprint.mineSetupCost
        }),
        new FirmBlueprint({
            id: "Wool Farm",
            recipe: new Recipe(
                new Map([[Good.Farming, 1], [Good.Crop, 1]]), Good.Wool, 2
            ),
            // Farms require farming labour to the very end.
            convertToAssembly: false,
            cost: FirmBlueprint.farmSetupCost
        }),
        new FirmBlueprint({
            id: "Dairy Farm",
            recipe: new Recipe(
                new Map([[Good.Farming, 1], [Good.Crop, 1]]), Good.Milk, 1
            ),
            // Farms require farming labour to the very end.
            convertToAssembly: false,
            cost: FirmBlueprint.farmSetupCost
        }),
        new FirmBlueprint({
            id: "Forest",
            recipe: new Recipe(
                new Map([[Good.Forestry, 1]]), Good.Wood, 5
            ),
            // Forests require forestry labour to the very end.
            convertToAssembly: false,
            cost: FirmBlueprint.forestSetupCost
        })
    ]

    static factoryBlueprints: FirmBlueprint[] = [
        // Heavy industry
        new FirmBlueprint({
            id: "Equipment Workshop",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.ProcessedWood, 5]]),
                Good.BasicEquipment, 1
            ),
            cost: FirmBlueprint.workshopSetupCost
        }),
        new FirmBlueprint({
            id: "Equipment Factory",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.BasicEquipment, 1], [Good.MachineParts, 5]]),
                Good.IndustrialEquipment, 1
            ),
            startingTier: FirmTier.Basic,
            cost: FirmBlueprint.basicSetupCost
        }),
        new FirmBlueprint({
            id: "Machine Factory",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.IndustrialEquipment, 1], [Good.Circuit, 1]]),
                Good.AdvancedEquipment, 1
            ),
            startingTier: FirmTier.Industrial,
            cost: FirmBlueprint.factorySetupCost
        }),
        // Power Plants
        new FirmBlueprint({
            id: "Coal Plant",
            recipe: new Recipe(
                // Coal roughly outputs 10 times the amount of electricity when put into a power plant.
                new Map([[Good.Assembly, 1], [Good.Coal, 10]]),
                Good.Electricity, 50
            ),
            startingTier: FirmTier.Basic,
            cost: FirmBlueprint.basicSetupCost
        }),
        new FirmBlueprint({
            id: "Wind Plant",
            recipe: new Recipe(
                // Power plants are more cost-efficient with maintenance.
                new Map([[Good.Technical, 1]]),
                Good.Electricity, 80
            ),
            // Technical labour is specialised, and will not be replaced with assembly.
            convertToAssembly: false,
            startingTier: FirmTier.Industrial,
            cost: FirmBlueprint.factorySetupCost,
            capacity: 50
        }),
        new FirmBlueprint({
            id: "Solar Plant",
            recipe: new Recipe(
                // Power plants are more cost-efficient with maintenance.
                new Map([[Good.Technical, 1]]),
                Good.Electricity, 80
            ),
            // Technical labour is specialised, and will not be replaced with assembly.
            convertToAssembly: false,
            startingTier: FirmTier.Advanced,
            cost: FirmBlueprint.advancedFactorySetupCost,
            capacity: 50
        }),
        // Intermediate products
        new FirmBlueprint({
            id: "Carpentry Workshop",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.Wood, 5]]),
                Good.ProcessedWood, 5
            ),
            cost: FirmBlueprint.workshopSetupCost
        }),
        new FirmBlueprint({
            id: "Chemical Plant",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.Oil, 4]]),
                Good.Chemicals, 4
            ),
            startingTier: FirmTier.Industrial,
            cost: FirmBlueprint.factorySetupCost
        }),
        new FirmBlueprint({
            id: "Forge",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.Mineral, 5], [Good.Coal, 1]]),
                Good.Metal, 5
            ),
            startingTier: FirmTier.Basic,
            cost: FirmBlueprint.basicSetupCost
        }),
        new FirmBlueprint({
            id: "Advanced Forge",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.PreciousMineral, 3], [Good.Coal, 1]]),
                Good.PreciousMetal, 3
            ),
            startingTier: FirmTier.Industrial,
            cost: FirmBlueprint.factorySetupCost
        }),
        new FirmBlueprint({
            id: "Motor Factory",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.MachineParts, 1], [Good.PreciousMetal, 1]]),
                Good.Motor, 2
            ),
            startingTier: FirmTier.Industrial,
            cost: FirmBlueprint.factorySetupCost
        }),
        new FirmBlueprint({
            id: "Circuits Factory",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.PreciousMetal, 1], [Good.Chemicals, 1]]),
                Good.Circuit, 1
            ),
            startingTier: FirmTier.Industrial,
            cost: FirmBlueprint.factorySetupCost
        }),
        new FirmBlueprint({
            id: "Machine Parts Factory",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.Metal, 3]]),
                Good.MachineParts, 5
            ),
            startingTier: FirmTier.Basic,
            cost: FirmBlueprint.basicSetupCost
        }),
        new FirmBlueprint({
            id: "Textile Factory",
            recipe: new Recipe(
                // Textiles start as artisan work, then gets replaced with assembly.
                new Map([[Good.Artisan, 1], [Good.Wool, 2]]),
                Good.Textile, 2
            ),
            startingTier: FirmTier.Basic,
            cost: FirmBlueprint.basicSetupCost
        }),
        new FirmBlueprint({
            id: "Flour Mill",
            recipe: new Recipe(
                new Map([[Good.Artisan, 1], [Good.Crop, 3]]),
                Good.Flour, 3
            ),
            startingTier: FirmTier.Basic,
            cost: FirmBlueprint.basicSetupCost
        }),
        // Consumer goods factories.
        new FirmBlueprint({
            id: "Clothes Factory",
            recipe: new Recipe(
                new Map([[Good.Artisan, 1], [Good.Textile, 2]]),
                Good.Clothes, 2
            ),
            startingTier: FirmTier.Basic,
            cost: FirmBlueprint.basicSetupCost
        }),
        new FirmBlueprint({
            id: "Meat Processing Plant",
            recipe: new Recipe(
                new Map([[Good.Artisan, 1], [Good.Meat, 1], [Good.Chemicals, 1]]),
                Good.ProcessedMeat, 3
            ),
            startingTier: FirmTier.Industrial,
            cost: FirmBlueprint.factorySetupCost
        }),
        new FirmBlueprint({
            id: "Crop Processing Plant",
            recipe: new Recipe(
                new Map([[Good.Artisan, 1], [Good.Crop, 1], [Good.Chemicals, 1]]),
                Good.ProcessedVegetables, 3
            ),
            startingTier: FirmTier.Industrial,
            cost: FirmBlueprint.factorySetupCost
        }),
        new FirmBlueprint({
            id: "Dairy Factory",
            recipe: new Recipe(
                new Map([[Good.Artisan, 1], [Good.Milk, 1]]),
                Good.Dairy, 3
            ),
            startingTier: FirmTier.Manual,
            cost: FirmBlueprint.workshopSetupCost
        }),
        new FirmBlueprint({
            id: "Bakery",
            recipe: new Recipe(
                new Map([[Good.Artisan, 1], [Good.Flour, 1]]),
                Good.Baked, 2
            ),
            startingTier: FirmTier.Manual,
            cost: FirmBlueprint.workshopSetupCost
        }),
        new FirmBlueprint({
            id: "Restaurant",
            recipe: new Recipe(
                new Map([[Good.Artisan, 1], [Good.Meat, 1], [Good.Crop, 1]]),
                Good.LuxuryFood, 1
            ),
            // Machines won't replace our cooks.
            convertToAssembly: false,
            startingTier: FirmTier.Manual,
            finalTier: FirmTier.Manual,
            cost: FirmBlueprint.workshopSetupCost
        }),
        new FirmBlueprint({
            id: "Furniture Factory",
            recipe: new Recipe(
                new Map([[Good.Artisan, 1], [Good.ProcessedWood, 1]]),
                Good.Furniture, 1
            ),
            finalTier: FirmTier.Basic,
            cost: FirmBlueprint.basicSetupCost
        }),
        new FirmBlueprint({
            id: "Luxury Furniture Workshop",
            recipe: new Recipe(
                new Map([[Good.Artisan, 1], [Good.ProcessedWood, 1], [Good.PreciousMetal, 1]]),
                Good.LuxuryFurniture, 1
            ),
            startingTier: FirmTier.Manual,
            finalTier: FirmTier.Manual,
            cost: FirmBlueprint.workshopSetupCost
        }),
        new FirmBlueprint({
            id: "Appliance Factory",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.MachineParts, 2]]),
                Good.Appliance, 1
            ),
            startingTier: FirmTier.Industrial,
            cost: FirmBlueprint.factorySetupCost
        }),
        new FirmBlueprint({
            id: "Smart Appliance Factory",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.Appliance, 1], [Good.Circuit, 1]]),
                Good.SmartAppliance, 1
            ),
            startingTier: FirmTier.Advanced,
            cost: FirmBlueprint.advancedFactorySetupCost
        }),
        new FirmBlueprint({
            id: "Electronics Factory",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.Circuit, 2]]),
                Good.Electronics, 1
            ),
            startingTier: FirmTier.Advanced,
            cost: FirmBlueprint.advancedFactorySetupCost
        }),
        new FirmBlueprint({
            id: "Automobile Factory",
            recipe: new Recipe(
                new Map([[Good.Assembly, 1], [Good.Circuit, 2], [Good.Motor, 2]]),
                Good.Automobiles, 1
            ),
            startingTier: FirmTier.Advanced,
            cost: FirmBlueprint.advancedFactorySetupCost
        }),
    ]
}