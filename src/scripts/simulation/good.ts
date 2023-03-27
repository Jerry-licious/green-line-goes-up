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
        Good.Furniture, Good.LuxuryFurniture, Good.Appliance, Good.SmartAppliance, Good.Electronics,
         Good.Automobiles];

    // All 6 types of labour available in the simulation.
    export const labourTypes: Good[] = [Good.Mining, Good.Farming, Good.Technical, Good.Forestry, Good.Artisan,
     Good.Assembly];

    export function getBaseUtility(good: string): number {
        switch (good) {
            case Good.Crop: return 10;
            case Good.Milk: return 25;
            case Good.Meat: return 30;
            case Good.Clothes: return 35;
            case Good.ProcessedMeat: return 20;
            case Good.ProcessedVegetables: return 7;
            case Good.Dairy: return 60;
            case Good.Baked: return 25;
            case Good.LuxuryFood: return 100;
            case Good.Furniture: return 100;
            case Good.LuxuryFurniture: return 300;
            case Good.Appliance: return 200;
            case Good.SmartAppliance: return 500;
            case Good.Electronics: return 300;
            case Good.Automobiles: return 600;
            default: return 0;
        }
    }

    export function isLabour(good: string) {
        switch (good) {
            case Good.Mining:
            case Good.Farming:
            case Good.Technical:
            case Good.Forestry:
            case Good.Artisan:
            case Good.Assembly:
                return true;
            default:
                return false;
        }
    }
}