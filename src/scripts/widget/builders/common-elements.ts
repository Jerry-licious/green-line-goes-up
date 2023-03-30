import {ElementBuilder} from './element-builder';

export class Div extends ElementBuilder {
    static simple(text: string, styleClasses: string[]): Div {
        return new Div({ text, styleClasses });
    }

    constructor({ styleClasses = [], children = [], text = '', href = '', title = '', onclick }: {
        styleClasses?: string[],
        children?: Element[],
        text?: string,
        href?: string,
        title?: string,
        onclick?: EventListener
    }) {
        super({
            tag: 'div', styleClasses, children, text, href, title, onclick
        });
    }
}

export class Span extends ElementBuilder {
    static simple(text: string, styleClasses: string[]): Span {
        return new Span({ text, styleClasses });
    }

    constructor({ styleClasses = [], children = [], text = '', href = '', title = '', onclick }: {
        styleClasses?: string[],
        children?: Element[],
        text?: string,
        href?: string,
        title?: string,
        onclick?: EventListener
    }) {
        super({
            tag: 'span', styleClasses, children, text, href, title, onclick
        });
    }
}

export class GameIcon extends ElementBuilder {
    constructor(icon: string, { styleClasses = [], children = [], href = '', title = '', onclick }: {
        styleClasses?: string[],
        children?: Element[],
        href?: string,
        title?: string,
        onclick?: EventListener
    } = {}) {
        super({
            tag: 'div', styleClasses: ['green-line', ...styleClasses], children, text: icon, href, title, onclick
        });
    }
}
export class GameIconButton extends ElementBuilder {
    constructor(icon: string, { styleClasses = [], children = [], href = '', title = '', onclick }: {
        styleClasses?: string[],
        children?: Element[],
        href?: string,
        title?: string,
        onclick?: EventListener
    } = {}) {
        super({
            tag: 'button', styleClasses: ['green-line', ...styleClasses], children, text: icon, href, title, onclick
        });
    }
}
export class MaterialIcon extends ElementBuilder {
    constructor(icon: string, { styleClasses = [], children = [], href = '', title = '', onclick }: {
        styleClasses?: string[],
        children?: Element[],
        href?: string,
        title?: string,
        onclick?: EventListener
    } = {}) {
        super({
            tag: 'div', styleClasses: ['material-icons', ...styleClasses], children, text: icon, href, title, onclick
        });
    }
}