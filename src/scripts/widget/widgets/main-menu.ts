import {Widget} from './widget';
import {App} from './app';
import {Div} from '../builders/common-elements';
import {ElementBuilder} from '../builders/element-builder';

export class MainMenu extends Widget<null> {
    constructor(app: App) {
        super('div', 'main-menu');

        this.domElement.append(
            Div.simple('Green Line Goes Up', ['title']).build(),
            Div.simple('An Economic Simulator Game', ['subtitle']).build(),
            new ElementBuilder({
                tag: 'button',
                styleClasses: ['primary'],
                text: 'Tutorial',
                onclick: () => {
                    app.openTutorial();
                }
            }).build(),
            new ElementBuilder({
                tag: 'button',
                styleClasses: ['primary'],
                text: 'Play',
                onclick: () => {
                    app.play();
                }
            }).build()
        )
    }

    updateElement(state: null | undefined): void {}
}