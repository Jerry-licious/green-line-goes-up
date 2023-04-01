import {Widget} from '../../../widget';
import {ElementBuilder} from '../../../../builders/element-builder';
import {Div} from '../../../../builders/common-elements';
import {NavigationBar} from './navigation-bar';

// State represents whether it's selected.
export class NavigationBarButton extends Widget<boolean> {
    index: number;
    // The owner of the button.
    rail: NavigationBar;

    constructor(icon: string, text: string, index: number, rail: NavigationBar) {
        super('div', 'option');

        this.index = index;
        this.rail = rail;

        this.addChildren(
            new Div({
                styleClasses: ['green-line'],
                text: icon
            }),
            new Div({
                styleClasses: ['description'],
                text: text
            })
        )

        // On-click, notify the rail of the change.
        this.domElement.addEventListener('click', function () {
            // Have the rail update its configuration.
            rail.updateElement(index);
        });
    }

    updateElement(state: boolean): void {
        if (state) {
            this.domElement.classList.add('selected');
        } else {
            this.domElement.classList.remove('selected');
        }
    }
}