// Create an element declaratively.
export class ElementBuilder {
    tag: string;
    namespace: string;
    styleClasses: string[];
    children: ElementBuilder[];
    text: string;

    // Href and title are attributes that are used very often, so it is added to the constructor despite having a
    // method to modify attributes directly.
    href: string;
    title: string;

    // Onclick is a listener that gets used very often, so it is added to the constructor despite having a method
    // to add event listeners.
    onclick: EventListener;

    attributes: Map<string, string> = new Map<string, string>();
    styleRules: Map<string, string> = new Map<string, string>();
    eventListeners: Map<string, EventListener> = new Map<string, EventListener>();

    // Use HTML as the default namespace, just in case we need some SVG elements.
    constructor({ tag, namespace = 'http://www.w3.org/1999/xhtml',
                    styleClasses = [], children = [], text = '', href = '', title = '', onclick }: {
        tag: string,
        namespace?: string,
        styleClasses?: string[],
        children?: ElementBuilder[],
        text?: string,
        href?: string,
        title?: string,
        onclick?: EventListener
    }) {
        this.tag = tag;
        this.namespace = namespace;
        this.styleClasses = styleClasses;
        this.children = children;
        this.text = text;
        this.href = href;
        this.title = title;
        this.onclick = onclick;
    }

    withStyleClasses(...classes: string[]): ElementBuilder {
        classes.forEach((styleClass) => this.styleClasses.push(styleClass));
        return this;
    }

    withAttribute(attribute: string, value: string): ElementBuilder {
        this.attributes.set(attribute, value);
        return this;
    }

    withEventListener(event: string, listener: EventListener): ElementBuilder {
        this.eventListeners.set(event, listener);
        return this;
    }

    // Actually create the element.
    build(): Element {
        const element = document.createElementNS(this.namespace, this.tag);
        this.styleClasses.forEach((styleClass) => element.classList.add(styleClass));
        this.children.forEach((child) => element.appendChild(child.build()));

        if (this.text) {
            element.appendChild(document.createTextNode(this.text));
        }
        if (this.href) {
            element.setAttribute('href', this.href);
        }
        if (this.title) {
            element.setAttribute('title', this.title);
        }
        if (this.onclick) {
            element.addEventListener('click', this.onclick);
        }

        this.attributes.forEach((value: string, attribute: string) => element.setAttribute(attribute, value));
        // Add the style if it is an HTML element.
        if (element instanceof HTMLElement) {
            this.styleRules.forEach((value: string, rule: string) => element.style.setProperty(rule, value));
        }

        this.eventListeners.forEach((listener, event) => element.addEventListener(event, listener));

        return element;
    }
}