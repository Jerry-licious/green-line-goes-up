import {GameWidget} from '../game-widget';
import {Game} from '../game';
import {Individual} from '../../../../simulation/actors/individual';
import {ElementBuilder} from '../../../builders/element-builder';
import {Div, GameIcon} from '../../../builders/common-elements';
import {Good} from '../../../../simulation/good';

export class IndividualWidget extends GameWidget<null> {
    individual: Individual;

    face: Element = new ElementBuilder({tag: 'img'})
        .withAttribute('src', 'img/fruit_of_labour_subsistence.svg').build();
    labour: Element = new ElementBuilder({tag: 'img'})
        .withAttribute('src', 'img/fruit_of_labour_labour.svg').build();

    preferredGoods: Element = Div.simple('', ['io']).build();
    job: Element = Div.simple('', ['io']).build();

    constructor(game: Game, individual: Individual) {
        super(game, 'div', 'fruit');

        this.individual = individual;

        this.domElement.append(
            this.preferredGoods,
            new Div({
                styleClasses: ['avatar'],
                children: [
                    this.face, this.labour,
                    new ElementBuilder({tag: 'img'})
                        .withAttribute('src', 'img/fruit_of_labour_strokes.svg').build()
                ]
            }).build(),
            this.job
        );
    }

    updateElement(state?: null) {}

    updateFace() {
        if (this.individual.lastUtility > 300) {
            this.face.setAttribute('src', 'img/fruit_of_labour_gainful.svg');
        } else if (this.individual.lastUtility > 30) {
            this.face.setAttribute('src', 'img/fruit_of_labour_subsistence.svg');
        } else {
            this.face.setAttribute('src', 'img/fruit_of_labour_struggling.svg');
        }
    }

    updateLabour() {
        switch (this.individual.mostProductiveLabour) {
            case Good.Forestry:
                this.labour.className = 'labour-forestry';
                break;
            case Good.Farming:
                this.labour.className = 'labour-farming';
                break;
            case Good.Technical:
                this.labour.className = 'labour-technical';
                break;
            case Good.Artisan:
                this.labour.className = 'labour-artisan';
                break;
            case Good.Assembly:
                this.labour.className = 'labour-assembly';
                break;
            case Good.Mining:
                this.labour.className = 'labour-mining';
                break;
        }
    }

    updateInputsAndOutputs() {
        this.removeChildren(this.preferredGoods);

        this.individual.preferences.forEach((good) => {
            this.preferredGoods.append(new GameIcon(good).build())
        });

        this.removeChildren(this.job);
        this.job.append(new GameIcon(this.individual.job).build());
    }


    gameTick() {
        this.updateFace();
        this.updateLabour();
        this.updateInputsAndOutputs();
    }
}