import {GameWidget} from '../game-widget';
import {Game} from '../game';
import {TechnologyCategory} from './technology-category';
import {FirmTier} from '../../../../simulation/firm-tier';
import {Good} from '../../../../simulation/good';

export class TechnologyWidget extends GameWidget<null> {
    categories: TechnologyCategory[];

    constructor(game: Game) {
        super(game, 'div', 'technology');

        // Collect the categories
        this.categories = FirmTier.values.map((tier) => {
            return {
                tier, goods: Good.values.filter((good) => Good.getTier(good) == tier)
            }
        }).map((category) => new TechnologyCategory(game, category.goods, FirmTier.name(category.tier)))

        this.domElement.append(...this.categories.map((category) => category.domElement));
    }

    gameTick() {
        for (let category of this.categories) {
            category.gameTick();
        }
    }

    updateElement(state?: null) {}
}