import {FirmBlueprintWidget} from './firm-blueprint-widget';
import {Firm} from '../../../../simulation/actors/firm';
import {FirmBlueprint} from '../../../../simulation/templates/firm-blueprint';
import {Div} from '../../../builders/common-elements';
import {GameWidget} from '../game-widget';
import {Game} from '../game';
import {ElementBuilder} from '../../../builders/element-builder';

export class FirmConstructionMenu extends GameWidget<null>{
    blueprints: FirmBlueprintWidget[];
    // The list to add the new firms to.
    target: Firm[];
    container: Element = Div.simple('', ['options']).build();

    constructor(game: Game, blueprints: FirmBlueprint[], target: Firm[]) {
        super(game, 'div', 'construct');

        this.target = target;
        this.blueprints = blueprints.map((blueprint) => new FirmBlueprintWidget(game, blueprint, this));

        this.domElement.append(
            Div.simple('Construct', ['message']).build(),
            this.container,
            new Div({
                styleClasses: ['actions'],
                children: [
                    new ElementBuilder({
                        tag: 'button',
                        styleClasses: ['primary', 'material-icons'],
                        text: 'close',
                        onclick: () => {
                            game.dismissConstructionMenu();
                        }
                    }).build()
                ]
            }).build()
        );

        this.container.append(...this.blueprints.map((blueprint) => blueprint.domElement));
    }

    removeBlueprint(blueprint: FirmBlueprintWidget) {
        this.blueprints.splice(this.blueprints.indexOf(blueprint), 1);
        this.container.removeChild(blueprint.domElement);
    }

    gameTick() {}
    updateElement(state?: null) {}
}