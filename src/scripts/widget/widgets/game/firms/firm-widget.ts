import {Firm} from '../../../../simulation/actors/firm';
import {Div, GameIcon} from '../../../builders/common-elements';
import {FirmTier} from '../../../../simulation/firm-tier';
import {ElementBuilder} from '../../../builders/element-builder';
import {Game} from '../game';
import {GameWidget} from '../game-widget';
import {OverlayActionMenu} from '../overlay-action-menu';
import {Basket} from '../../../../simulation/basket';

export class FirmWidget extends GameWidget<null> {
    firm: Firm;
    game: Game;

    // Inputs and Outputs
    inputs: Element = Div.simple('', ['io']).build();
    outputs: Element = Div.simple('', ['io']).build();

    upgradeStatus: Element = Div.simple('', []).build();
    capacityBar: Element = Div.simple('', ['capacity-bar']).build();

    upgradeButton: HTMLElement;
    errorButton: Element = Div.simple('', ['error', 'material-icons']).build();

    constructor(firm: Firm, game: Game) {
        super(game, 'div', 'factory');

        this.firm = firm;
        this.game = game;

        this.upgradeButton = new ElementBuilder({
            tag: 'button',
            styleClasses: ['tertiary'],
            text: 'Upgrade',
            onclick: () => {
                let targetTier = FirmTier.next(this.firm.tier);

                game.openActionMenu(new OverlayActionMenu(
                    game, `Upgrade ${this.firm.id}`,
                    FirmTier.cost(targetTier),
                    () => {
                        this.firm.setTier(targetTier);

                        this.updateButtons();
                        this.updateUpgradeStatus();
                    }
                ))
            }
        }).build() as HTMLElement;

        this.domElement.append(
            Div.simple('', ['background']).build(),
            new Div({
                styleClasses: ['overlay'],
                children: [new Div({
                    styleClasses: ['content'],
                    children: [
                        this.inputs,
                        new Div({
                            styleClasses: ['fill', 'info'],
                            children: [
                                new Div({
                                    styleClasses: ['top'],
                                    children: [
                                        Div.simple(this.firm.id, ['name']).build(),
                                        Div.simple('', ['fill']).build(),
                                        this.upgradeStatus
                                    ]
                                }).build(),
                                new Div({
                                    styleClasses: ['capacity'],
                                    children: [this.capacityBar]
                                }).build(),
                                new Div({
                                    styleClasses: ['actions'],
                                    children: [
                                        new ElementBuilder({
                                            tag: 'button',
                                            styleClasses: ['tertiary'],
                                            text: 'Subsidise',
                                            onclick: () => {
                                                this.game.openActionMenu(new OverlayActionMenu(
                                                    game, "Supply Production Needs",
                                                    Basket.withItems(this.firm.buyGoal), () => {
                                                        for (let goal of this.firm.buyGoal) {
                                                            this.firm.inventory.addGood(goal[0], goal[1]);
                                                            this.firm.buyGoal.set(goal[0], 0);
                                                        }
                                                        this.firm.consumeGoods();
                                                    }
                                                ))
                                            }}
                                        ).build(),
                                        this.upgradeButton,
                                        Div.simple('', ['fill']).build(),
                                        this.errorButton
                                    ]
                                }).build()
                            ]
                        }).build(),
                        this.outputs
                    ]
                }).build()]
            }).build()
        );

        this.updateUpgradeStatus();
        this.updateInputs();
        this.updateOutputs();
        this.updateCapacityBar();
        this.updateError();
    }

    updateUpgradeStatus() {
        if (this.firm.tier == FirmTier.Manual) {
            // Manual tier doesn't have an icon.
            this.upgradeStatus.classList.remove('green-line');
        } else {
            this.upgradeStatus.classList.add('green-line');
            this.upgradeStatus.innerHTML = FirmTier.icon(this.firm.tier);
        }
    }

    // Refreshes the input element based on the firm's inputs.
    updateInputs() {
        // Clean it up.
        this.removeChildren(this.inputs);

        this.firm.recipe.inputs.forEach((_, good) => {
            this.inputs.appendChild(
                new GameIcon(good).build()
            );
        });
    }

    // Refreshes the output element based on the firm's outputs.
    updateOutputs() {
        // Clean it up.
        this.removeChildren(this.outputs);

        this.outputs.appendChild(new GameIcon(this.firm.recipe.output).build());
    }

    updateCapacityBar() {
        (this.capacityBar as HTMLElement).style.width = `${this.firm.lastProduction / this.firm.maxCapacity * 95 + 5}%`;
    }

    updateButtons() {
        // Hide the upgrade button if no upgrades are available.
        if (!this.upgradeAvailable()) {
            this.upgradeButton.style.display = 'none';
        }
    }

    updateError() {
        (this.errorButton as HTMLElement).style.display = 'none';
    }

    updateElement(state: null | undefined): void {
    }

    gameTick() {
        this.updateCapacityBar();
        this.updateError();
    }

    upgradeAvailable() {
        return FirmTier.next(this.firm.tier) != null && this.firm.tier != this.firm.finalTier;
    }
}