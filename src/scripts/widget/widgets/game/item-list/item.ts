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

        this.amountElement = Div.simple((Math.round(amount * 100) / 100).toString(), ['amount']).build();

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
        this.amountElement.innerHTML = (Math.round(state * 100) / 100).toString();

        // Display an error.
        if (state >= 0 && this.domElement.classList.contains('error')) {
            this.domElement.classList.remove('error');
        } else if (state < 0 && !this.domElement.classList.contains('error')) {
            this.domElement.classList.add('error');
        }
    }
}