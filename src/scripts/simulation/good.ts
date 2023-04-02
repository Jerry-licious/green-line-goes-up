import {FirmTier} from './firm-tier';

export enum Good {
    // Resources
    Coal = 'coal',
    Oil = 'oil',
    Wood = 'wood',
    Mineral = 'mineral',
    PreciousMineral = 'precious_mineral',
    Rocks = 'rock',
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
    BasicEquipment = 'basic_tools',
    IndustrialEquipment = 'industrial_tools',
    AdvancedEquipment = 'advanced_tools',
    MobileEquipment = 'mobile_tools',
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

    export function name(good: Good) {
        switch (good) {
            case Good.Coal:
                return 'Coal';
            case Good.Oil:
                return 'Oil';
            case Good.Wood:
                return 'Wood';
            case Good.Mineral:
                return 'Mineral';
            case Good.PreciousMineral:
                return 'Precious Mineral';
            case Good.Rocks:
                return 'Rock';
            case Good.Crop:
                return 'Crop';
            case Good.Fruit:
                return 'Fruit';
            case Good.Milk:
                return 'Milk';
            case Good.Wool:
                return 'Wool';
            case Good.Meat:
                return 'Meat';
            case Good.Mining:
                return 'Mining';
            case Good.Farming:
                return 'Farming';
            case Good.Technical:
                return 'Technical';
            case Good.Forestry:
                return 'Forestry';
            case Good.Artisan:
                return 'Artisan';
            case Good.Assembly:
                return 'Assembly';
            case Good.BasicEquipment:
                return 'Basic Equipment';
            case Good.IndustrialEquipment:
                return 'Industrial Equipment';
            case Good.AdvancedEquipment:
                return 'Advanced Equipment';
            case Good.MobileEquipment:
                return 'Mobile Equipment';
            case Good.Fertilizer:
                return 'Fertilizer';
            case Good.Electricity:
                return 'Electricity';
            case Good.ProcessedWood:
                return 'Processed Wood';
            case Good.Chemicals:
                return 'Chemicals';
            case Good.Metal:
                return 'Metal';
            case Good.PreciousMetal:
                return 'Precious Metal';
            case Good.Motor:
                return 'Motor';
            case Good.Circuit:
                return 'Circuit';
            case Good.MachineParts:
                return 'Machine Parts';
            case Good.Textile:
                return 'Textile';
            case Good.Flour:
                return 'Flour';
            case Good.Clothes:
                return 'Clothes';
            case Good.ProcessedMeat:
                return 'Processed Meat';
            case Good.ProcessedFruit:
                return 'Processed Fruit';
            case Good.ProcessedVegetables:
                return 'Processed Vegetables';
            case Good.Dairy:
                return 'Dairy';
            case Good.Baked:
                return 'Baked';
            case Good.LuxuryFood:
                return 'Luxury Food';
            case Good.Furniture:
                return 'Furniture';
            case Good.LuxuryFurniture:
                return 'Luxury Furniture';
            case Good.Appliance:
                return 'Appliance';
            case Good.SmartAppliance:
                return 'Smart Appliance';
            case Good.Electronics:
                return 'Electronics';
            case Good.Automobiles:
                return 'Automobiles';
        }
    }

    // Tier
    export function getTier(good: Good): FirmTier {
        switch (good) {
            case Good.Coal:
            case Good.Oil:
            case Good.Wood:
            case Good.Mineral:
            case Good.PreciousMineral:
            case Good.Rocks:
            case Good.Crop:
            case Good.Fruit:
            case Good.Milk:
            case Good.Wool:
            case Good.Meat:
            case Good.Mining:
            case Good.Farming:
            case Good.Technical:
            case Good.Forestry:
            case Good.Artisan:
            case Good.Assembly:
            case Good.BasicEquipment:
            case Good.ProcessedWood:
            case Good.Dairy:
            case Good.Baked:
            case Good.Flour:
            case Good.LuxuryFood:
            case Good.LuxuryFurniture:
                return FirmTier.Manual;

            case Good.Electricity:
            case Good.IndustrialEquipment:
            case Good.Metal:
            case Good.MachineParts:
            case Good.Textile:
            case Good.Clothes:
            case Good.Furniture:
                return FirmTier.Basic;

            case Good.Chemicals:
            case Good.PreciousMetal:
            case Good.Motor:
            case Good.Circuit:
            case Good.Fertilizer:
            case Good.AdvancedEquipment:
            case Good.ProcessedMeat:
            case Good.ProcessedFruit:
            case Good.ProcessedVegetables:
            case Good.Appliance:
                return FirmTier.Industrial;

            case Good.SmartAppliance:
            case Good.Electronics:
            case Good.Automobiles:
            case Good.MobileEquipment:
                return FirmTier.Advanced;
        }
    }
}