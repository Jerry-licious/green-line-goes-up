export enum Good {
    // Resources
    Coal = 'coal',
    Oil = 'oil',
    Wood = 'wood',
    Mineral = 'mineral',
    PreciousMineral = 'precious_mineral',
    Rocks = 'rocks',
    Crop = 'crop',
    Fruit = 'fruit',
    Milk = 'milk',
    Wool = 'wool',
    Meat = 'meat',
    // Labour
    Mining = 'mining',
    Farming = 'farming',
    Technical = 'technical',
    Forestry = 'forestry',
    Artisan = 'artisan',
    Assembly = 'assembly',
    // Equipment
    BasicEquipment = 'basic_eq',
    IndustrialEquipment = 'industrial_eq',
    AdvancedEquipment = 'advanced_eq',
    MobileEquipment = 'mobile_eq',
    Fertilizer = 'fertilizer',
    // Intermediate Goods
    Electricity = 'electricity',
    ProcessedWood = 'processed_wood',
    Chemicals = 'chemicals',
    Metal = 'metal',
    PreciousMetal = 'precious_metal',
    Motor = 'motor',
    Circuit = 'circuit',
    MachineParts = 'machine_parts',
    Textile = 'textile',
    Flour = 'flour',
    // Consumer Goods
    Clothes = 'clothes',
    ProcessedMeat = 'processed_meat',
    ProcessedFruit = 'processed_fruit',
    ProcessedVegetables = 'processed_vegetables',
    Dairy = 'dairy',
    Baked = 'baked',
    LuxuryFood = 'luxury_food',
    Furniture = 'furniture',
    LuxuryFurniture = 'luxury_furniture',
    Appliance = 'appliance',
    SmartAppliance = 'smart_appliance',
    Electronics = 'electronics',
    Automobiles = 'automobiles'
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

    export function getBaseUtility(good: string): number {
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