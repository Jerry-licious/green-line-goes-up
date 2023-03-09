export enum Good {
    // Resources
    Coal,
    Oil,
    Wood,
    Mineral,
    PreciousMineral,
    Rocks,
    Crop,
    Fruit,
    Milk,
    Wool,
    Meat,
    // Labour
    Mining,
    Farming,
    Technical,
    Forestry,
    Artisan,
    Assembly,
    // Equipment
    BasicEquipment,
    IndustrialEquipment,
    AdvancedEquipment,
    MobileEquipment,
    Fertilizer,
    // Intermediate Goods
    Electricity,
    ProcessedWood,
    Chemicals,
    Metal,
    PreciousMetal,
    Motor,
    Circuit,
    MachineParts,
    Textile,
    Flour,
    // Consumer Goods
    Clothes,
    ProcessedMeat,
    ProcessedFruit,
    ProcessedVegetables,
    Dairy,
    Baked,
    LuxuryFood,
    Furniture,
    LuxuryFurniture,
    Appliance,
    SmartAppliance,
    Electronics,
    Automobiles
}

export namespace Good {
    // Why not use Object.values? To preserve type.
    export const values: Good[] = [Good.Coal, Good.Oil, Good.Wood, Good.Mineral, Good.PreciousMineral, Good.Rocks, Good.Crop,
        Good.Fruit, Good.Milk, Good.Wool, Good.Meat,
        Good.Mining, Good.Farming, Good.Technical, Good.Forestry, Good.Artisan, Good.Assembly,
        Good.BasicEquipment, Good.IndustrialEquipment, Good.AdvancedEquipment, Good.MobileEquipment, Good.Fertilizer,
        Good.Electricity, Good.ProcessedWood, Good.Chemicals, Good.Metal,
        Good.PreciousMetal, Good.Motor, Good.Circuit, Good.MachineParts, Good.Textile, Good.Flour, Good.Clothes,
        Good.ProcessedMeat, Good.ProcessedFruit, Good.ProcessedVegetables, Good.Dairy, Good.Baked, Good.LuxuryFood,
        Good.Furniture, Good.LuxuryFurniture, Good.Appliance, Good.SmartAppliance, Good.Electronics, Good.Automobiles];

    export function getBaseUtility(good: Good): number {
        switch (good) {
            case Good.Crop: return 10;
            case Good.Fruit: return 13;
            case Good.Milk: return 12;
            case Good.Meat: return 20;
            case Good.Clothes: return 25;
            case Good.ProcessedMeat: return 15;
            case Good.ProcessedFruit: return 8;
            case Good.ProcessedVegetables: return 7;
            case Good.Dairy: return 20;
            case Good.Baked: return 15;
            case Good.LuxuryFood: return 30;
            case Good.LuxuryFurniture: return 50;
            case Good.Appliance: return 40;
            case Good.SmartAppliance: return 60;
            case Good.Electronics: return 50;
            case Good.Automobiles: return 80;
            default: return 0;
        }
    }
}