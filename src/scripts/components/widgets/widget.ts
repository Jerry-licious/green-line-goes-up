// An object that can be displayed as a DOM element.
// S is the type of state passed down for rendering.
import {ElementBuilder} from '../builders/element-builder';

export abstract class Widget<S> {
    // A DOM element that represents this widget.
    domElement: Element;
    lastState: S;

    constructor(tag: string, ...styleClasses: string[]) {
        this.domElement = document.createElement(tag);
        styleClasses.forEach((styleClasses) => this.domElement.classList.add(styleClasses));
    }

    protected clearElement(): void {
        while (this.domElement.hasChildNodes()) {
            this.domElement.removeChild(this.domElement.firstChild);
        }
    }

    render(state?: S): Element {
        this.lastState = state;

        this.clearElement();
        this.updateElement(state);

        return this.domElement;
    }

    // Renders using the previous state.
    rerender() {
        this.render(this.lastState);
    }

    addChildren(...children: ElementBuilder[]): void {
        children.map(builder => builder.build())
            .forEach(element => this.domElement.append(element));
    }

    abstract updateElement(state?: S): void;
}