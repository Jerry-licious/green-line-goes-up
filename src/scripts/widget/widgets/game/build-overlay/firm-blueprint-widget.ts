import {Game} from '../game';
import {GameWidget} from '../game-widget';
import {FirmBlueprint} from '../../../../simulation/templates/firm-blueprint';
import {Div, GameIcon} from '../../../builders/common-elements';
import {ElementBuilder} from '../../../builders/element-builder';
import {OverlayActionMenu} from '../overlay-action-menu';
import {FirmConstructionMenu} from './firm-construction-menu';
import {FirmTier} from '../../../../simulation/firm-tier';
import {Good} from '../../../../simulation/good';

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
                            children: [...Array.from(blueprint.recipe.inputs.keys())
                                .map((good) => new GameIcon(good).build()),
                                // Include a coal icon if the firm starts off at industrial tier and consumes coal.
                                ... blueprint.startingTier == FirmTier.Industrial && blueprint.consumesCoal ?
                                    [new GameIcon(Good.Coal).build()] : [],
                                // Include an electricity icon if it starts off advanced and consumes electricity,
                                ... blueprint.startingTier == FirmTier.Advanced && blueprint.consumesElectricity?
                                    [new GameIcon(Good.Electricity).build()] : []]
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
                                                    () => { this.buildFirm() }
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

    buildFirm() {
        this.overlay.target.push(this.blueprint.createFirm());
        this.overlay.removeBlueprint(this);
    }

    gameTick() {}
    updateElement(state?: null) {}
}