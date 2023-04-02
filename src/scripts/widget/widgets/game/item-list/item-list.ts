import {Basket} from '../../../../simulation/basket';
import {Widget} from '../../widget';
import {Div} from '../../../builders/common-elements';
import {Item} from './item';
import {Good} from '../../../../simulation/good';

export class ItemList extends Widget<null> {
    basket: Map<Good, number>;
    allowDelete: boolean;

    list: Element = Div.simple('', ['list']).build();
    items: Item[] = [];

    constructor(basket: Map<Good, number>, title: string, allowDelete: boolean) {
        super('div', 'item-list');

        this.basket = basket;
        this.allowDelete = allowDelete;

        this.domElement.append(
            Div.simple(title, ['title']).build(),
            this.list
        );
    }

    removeGood(item: Item) {
        this.basket.delete(item.good);
        this.items.splice(this.items.indexOf(item), 1);
        this.list.removeChild(item.domElement);
    }

    updateElement(): void {
        for (let entry of this.basket) {
            let item = this.items.find((item) => item.good == entry[0]);
            // If this item is already included.
            if (item) {
                // But the amount is 0.
                if (entry[1] == 0) {
                    // Remove it from our entries.
                    this.items.splice(this.items.indexOf(item), 1);
                    this.list.removeChild(item.domElement);
                }
            } else {
                // If it hasn't been included, and there's a valid entry.
                if (entry[1] != 0) {
                    let newItem = new Item(entry[0], entry[1], this, this.allowDelete);

                    this.items.push(newItem);
                    this.list.append(newItem.domElement);
                }
            }
        }

        for (let item of this.items) {
            item.updateElement(this.basket.get(item.good));
        }
    }
}