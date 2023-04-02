import {Widget} from '../../widget';
import {Good} from '../../../../simulation/good';
import {Div, GameIcon} from '../../../builders/common-elements';
import {ItemList} from './item-list';
import {ElementBuilder} from '../../../builders/element-builder';

export class Item extends Widget<number> {
    good: Good;
    amountElement: Element;
    list: ItemList;

    constructor(good: Good, amount: number, list: ItemList, allowDelete: boolean) {
        super('div', 'entry');

        this.good = good;
        this.list = list;

        this.amountElement = Div.simple(amount.toString(), ['amount']).build();

        this.domElement.append(
            new GameIcon(good).build(),
            Div.simple('', ['fill']).build(),
            this.amountElement,
            ... allowDelete ? [
                new ElementBuilder({
                    tag: 'button',
                    text: 'cancel',
                    styleClasses: ['material-icons', 'primary-container'],
                    onclick: () => {
                        list.removeGood(this);
                    }
                }).build()
            ] : []
        )
    }

    updateElement(state: number) {
        this.amountElement.innerHTML = state.toString();

        // Display an error.
        if (state >= 0 && this.amountElement.classList.contains('error')) {
            this.amountElement.classList.remove('error');
        } else if (state < 0 && !this.amountElement.classList.contains('error')) {
            this.amountElement.classList.add('error');
        }
    }
}