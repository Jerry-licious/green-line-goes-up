import {GameWidget} from '../game-widget';
import {Good} from '../../../../simulation/good';
import {Game} from '../game';
import {Div} from '../../../builders/common-elements';
import {GoodWidget} from './good-widget';

export class TechnologyCategory extends GameWidget<null>{
    goods: GoodWidget[];

    constructor(game: Game, goods: Good[], title: string) {
        super(game, 'div', 'category');

        this.goods = goods.map((good) => new GoodWidget(game, good));

        this.domElement.append(
            Div.simple(title, ['title']).build(),
            new Div({
                styleClasses: ['list'],
                children: this.goods.map((good) => good.domElement)
            }).build()
        )
    }

    gameTick(): void {
        for (let good of this.goods) {
            good.gameTick();
        }
    }

    updateElement(state: null | undefined): void {}
}