import {Basket} from '../../../simulation/basket';
import {GameWidget} from './game-widget';
import {Game} from './game';
import {Div} from '../../builders/common-elements';
import {ElementBuilder} from '../../builders/element-builder';
import {ItemList} from './item-list/item-list';

export class OverlayActionMenu extends GameWidget<null> {
    constructor(game: Game, message: string, cost: Basket, action: () => void) {
        super(game, 'div', 'spend');

        // List of goods required.
        let costGoods = cost.listOfItems();

        let inventory = game.simulation.government.inventory.copyWithItemsOfInterest(costGoods);
        let basketAfterAction = inventory.subtract(cost).copyWithItemsOfInterest(costGoods);

        console.log(inventory);
        console.log(basketAfterAction);

        let doneButton = new ElementBuilder({
                tag: 'button',
                styleClasses: ['material-icons', 'primary'],
                text: 'done',
                onclick: () => {
                    action();
                    game.simulation.government.inventory.removeItemsFrom(cost);
                    game.dismissActionMenu();
                }
            }).build();

        // Prevent the button from being clicked if the player can't afford it.
        (doneButton as HTMLButtonElement).disabled = basketAfterAction.hasNegatives();

        this.domElement.append(
            Div.simple(message, ['message']).build(),
            new Div({
                styleClasses: ['spend-info'],
                children: [
                    new ItemList(inventory, 'Inventory', true, false).domElement,
                    new ItemList(basketAfterAction, 'After', true, false).domElement,
                ]
            }).build(),
            new Div({
                styleClasses: ['actions'],
                children: [
                    doneButton,
                    new ElementBuilder({
                        tag: 'button',
                        styleClasses: ['material-icons', 'primary'],
                        text: 'close',
                        onclick: () => {
                            game.dismissActionMenu();
                        }
                    }).build()
                ]
            }).build()
        )
    }

    gameTick(): void {}
    updateElement(state: null | undefined): void {}
}