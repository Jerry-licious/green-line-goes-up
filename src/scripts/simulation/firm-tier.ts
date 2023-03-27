import {Config} from './configs';

// Firms can be upgraded. Every tier of upgrade dramatically increases their productivity.
export enum FirmTier {
    Manual, Basic, Industrial, Advanced
}

export namespace FirmTier {
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

    export function efficiencyMultiplier(upgrade: FirmTier) {
        return Math.pow(Config.upgradeMultiplier, tier(upgrade));
    }
}