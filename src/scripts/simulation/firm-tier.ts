import {Config} from './configs';
import {Good} from './good';
import {Basket} from './basket';

// Firms can be upgraded. Every tier of upgrade dramatically increases their productivity.
export enum FirmTier {
    Manual, Basic, Industrial, Advanced
}

export namespace FirmTier {
    export const values: FirmTier[] = [FirmTier.Manual, FirmTier.Basic, FirmTier.Industrial, FirmTier.Advanced];

    export function next(upgrade: FirmTier): FirmTier {
        switch (upgrade) {
            case FirmTier.Manual:
                return FirmTier.Basic;
            case FirmTier.Basic:
                return FirmTier.Industrial;
            case FirmTier.Industrial:
                return FirmTier.Advanced;
            case FirmTier.Advanced:
                return null;
        }
    }

    export function tier(upgrade: FirmTier) {
        switch (upgrade) {
            case FirmTier.Manual:
                return 0;
            case FirmTier.Basic:
                return 1;
            case FirmTier.Industrial:
                return 2;
            case FirmTier.Advanced:
                return 3;
        }
    }

    export function icon(upgrade: FirmTier): Good {
        switch (upgrade) {
            case FirmTier.Manual:
                return Good.Assembly;
            case FirmTier.Basic:
                return Good.BasicEquipment;
            case FirmTier.Industrial:
                return Good.IndustrialEquipment;
            case FirmTier.Advanced:
                return Good.AdvancedEquipment;
        }
    }

    export function efficiencyMultiplier(upgrade: FirmTier) {
        return Math.pow(Config.upgradeMultiplier, tier(upgrade));
    }

    export function cost(upgrade: FirmTier) {
        switch (upgrade) {
            case FirmTier.Manual:
                return null;
            case FirmTier.Basic:
                return Basket.withItems(new Map<Good, number>([[Good.BasicEquipment, 250]]));
            case FirmTier.Industrial:
                return Basket.withItems(new Map<Good, number>([[Good.IndustrialEquipment, 250]]));
            case FirmTier.Advanced:
                return Basket.withItems(new Map<Good, number>([[Good.AdvancedEquipment, 250]]));
        }
    }

    export function name(upgrade: FirmTier) {
        switch (upgrade) {
            case FirmTier.Manual:
                return 'Manual';
            case FirmTier.Basic:
                return 'Basic';
            case FirmTier.Industrial:
                return 'Industrial';
            case FirmTier.Advanced:
                return 'Advanced';
        }
    }
}