import {Widget} from './widget';
import {App} from './app';
import {Div} from '../builders/common-elements';
import {ElementBuilder} from '../builders/element-builder';

export class InfoPanel extends Widget<number> {
    images: string[];
    titles: string[];
    texts: string[];

    app: App;

    imageElement: HTMLImageElement = new ElementBuilder({tag: 'img'})
        .withAttribute('src', '').build() as HTMLImageElement;
    titleElement: Element = Div.simple('', ['title']).build();
    textElement: Element = Div.simple('', ['text']).build();

    previousButton: HTMLButtonElement;
    nextButton: HTMLButtonElement;

    constructor(app: App, images: string[], titles: string[], texts: string[]) {
        super('div', 'tutorial');

        this.lastState = 0;
        this.images = images;
        this.titles = titles;
        this.texts = texts;

        this.previousButton = new ElementBuilder({
            tag: 'button',
            styleClasses: ['primary', 'material-icons'],
            text: 'navigate_before',
            onclick: () => {
                this.render(this.lastState - 1);
            }
        }).build() as HTMLButtonElement;
        this.nextButton = new ElementBuilder({
            tag: 'button',
            styleClasses: ['primary', 'material-icons'],
            text: 'navigate_next',
            onclick: () => {
                this.render(this.lastState + 1);
            }
        }).build() as HTMLButtonElement;

        this.domElement.append(
            new Div({
                styleClasses: ['image'],
                children: [ this.imageElement ]
            }).build(),
            new Div({
                styleClasses: ['content'],
                children: [
                    this.titleElement,
                    this.textElement,
                    new Div({
                        styleClasses: ['actions'],
                        children: [
                            new ElementBuilder({
                                tag: 'button',
                                styleClasses: ['primary', 'material-icons'],
                                text: 'close',
                                onclick: () => {
                                    app.menu();
                                }
                            }).build(),
                            this.previousButton,
                            Div.simple('', ['fill']).build(),
                            this.nextButton
                        ]
                    }).build()
                ]
            }).build()
        );

        this.render(0);
    }

    updateElement(state: number): void {
        this.lastState = state;

        this.imageElement.src = this.images[state];
        this.titleElement.innerHTML = this.titles[state];
        this.textElement.innerHTML = this.texts[state];

        this.previousButton.disabled = state == 0;
        this.nextButton.disabled = state == this.images.length - 1;
    }
}