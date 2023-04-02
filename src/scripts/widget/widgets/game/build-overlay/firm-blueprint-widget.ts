import {Game} from '../game';
import {GameWidget} from '../game-widget';
import {FirmBlueprint} from '../../../../simulation/templates/firm-blueprint';
import {Div, GameIcon} from '../../../builders/common-elements';
import {ElementBuilder} from '../../../builders/element-builder';
import {OverlayActionMenu} from '../overlay-action-menu';
import {FirmConstructionMenu} from './firm-construction-menu';

export class FirmBlueprintWidget extends GameWidget<null> {
    blueprint: FirmBlueprint;
    overlay: FirmConstructionMenu;

    constructor(game: Game, blueprint: FirmBlueprint, overlay: FirmConstructionMenu) {
        super(game, 'div', 'factory');

        this.blueprint = blueprint;
        this.overlay = overlay;

        this.domElement.append(
            Div.simple('', ['background']).build(),
            new Div({
                styleClasses: ['overlay'],
                children: [new Div({
                    styleClasses: ['content'],
                    children: [
                        new Div({
                            styleClasses: ['io'],
                            children: Array.from(blueprint.recipe.inputs.keys())
                                .map((good) => new GameIcon(good).build())
                        }).build(),
                        new Div({
                            styleClasses: ['fill', 'info'],
                            children: [
                                new Div({
                                    styleClasses: ['top'],
                                    children: [
                                        Div.simple(blueprint.firmID, ['name']).build()
                                    ]
                                }).build(),
                                new Div({
                                    styleClasses: ['actions'],
                                    children: [
                                        new ElementBuilder({
                                            tag: 'button',
                                            styleClasses: ['primary'],
                                            text: 'Build',
                                            onclick: () => {
                                                game.openActionMenu(new OverlayActionMenu(
                                                    game,
                                                    `Build ${blueprint.firmID}`,
                                                    blueprint.cost,
                                                    () => {
                                                        overlay.target.push(blueprint.createFirm());
                                                        overlay.removeBlueprint(this);
                                                    }
                                                ));
                                            }
                                        }).build()
                                    ]
                                }).build()
                            ]
                        }).build(),
                        new Div({
                            styleClasses: ['io'],
                            children: [new GameIcon(this.blueprint.recipe.output).build()]
                        }).build(),
                    ]
                }).build()]
            }).build()
        );
    }

    gameTick() {}
    updateElement(state?: null) {}
}