import {Widget} from './widget';
import {App} from './app';
import {Div} from '../builders/common-elements';
import {ElementBuilder} from '../builders/element-builder';

export class Tutorial extends Widget<number> {
    images = ['img/tutorial1.png', 'img/tutorial2.png', 'img/tutorial3.png', 'img/tutorial4.png', 'img/tutorial5.png', 'img/tutorial6.png', 'img/tutorial7.png', 'img/tutorial8.png'];
    titles = [
        'Fruit of Labour',
        'Make Them Happy',
        'Market Economy',
        'Human Capital',
        'Favourites',
        'Firms',
        'Circular Flow',
        'GDP'
    ];
    texts = [
        `Say hello to our economic actor, the fruit of labour! In the simulation, the fruit of labour represents an individual person, and there are a total of 100 fruits to represent a small population. Each person likes to consume goods and would want to spend money to get them. When they consume something, they gain what's called "utility", the economist's way of quantifying happiness. It's generally assumed that the more things someone consumes, the happier they get. Whether that's true is up to debate, but it's true for our little fruits. There are two basic rules: the more the better, and the more varied and different the better.`,
        `In the simulation, you will see that a fruit could be struggling if it doesn't earn enough of an income to buy goods that make it happy. It could be living at subsistence level if it earns just enough money to buy some basic goods every day. However, if you, the government, do a really good job at developing the economy, our fruits of labour will turn golden to show that they are living the time of their lives. `,
        `Our simulation is organised through markets. Each fruit keeps track of the price of their favourite goods, and, every day, considers if it's worth buying something. If lots of fruits want the same thing and are willing to pay big money for it, then its price would go up. If nobody wants something, its price will plummet. Eventually, everybody settles on some kind of spending habit and prices stabilise. You, as the government, have the ability to buy from the market as well. However, money you spend is printed, meaning that everything you buy will inflate the prices. Spend wisely!`,
        `Each fruit at birth is gifted with a kind of talent, the ability to produce a certain kind of labour more efficiently than the others. There are six types of labour: mining, artisan, forestry, farming, assembly, and technical, each with their own applications. However, no matter how talented a fruit is, if no one is willing to employ it, then it has to work somewhere else. Make sure to diversify the economy so everyone can work their favourite jobs!`,
        `Each fruit also has their favourite things to consume. When you hover over a fruit, you will see their top three goods, and their current job. `,
        `How do things get made? Firms serve as a vital part of the economy that transforms labour into goods. Take a forest for example, we may employ fruits and get some forestry labour to obtain some wood as a result. All goods in the economy are produced by firms, and it is your job, as the government, to build them one by one. In addition, firms can become more efficient by receiving upgrades. By providing firms with advanced tools, you can double their productivity with every upgrade, freeing up fruits to work on other things while producing more! Sometimes, firms may struggle and cannot afford their inputs, as the government can help them out in the short-term by supplying their goods, but in the long run a failing firm will stay a failing firm.`,
        `In the simulation, a "cycle" is our basic unit of time. In every cycle, our fruits pick their jobs and sell their labour to firms. Firms in term use their labour to produce goods, and sell the goods back to the fruits. The fruits pay money for the goods, and firms pay this money back to the fruits as a wage. This beautiful cycle will keep the economy running as money and goods swap between individuals and firms.`,
        `The Gross Domestic Product (GDP), is the total value of everything your simulation produces in a period of time, in this case every cycle. Your job as the government is to make this line go up, by constructing and upgrading firms, and producing more and better things over time. To help you out, every cycle you will be awarded a portion of your GDP as your credit. Spend credits to print money and buy things from the market. While prices will go up in the long run, you will be able to increase the productivity of the economy meanwhile, and make everyone's lives better!`
    ];

    app: App;

    imageElement: HTMLImageElement = new ElementBuilder({tag: 'img'})
        .withAttribute('src', this.images[0]).build() as HTMLImageElement;
    titleElement: Element = Div.simple('', ['title']).build();
    textElement: Element = Div.simple('', ['text']).build();

    previousButton: HTMLButtonElement;
    nextButton: HTMLButtonElement;

    constructor(app: App) {
        super('div', 'tutorial');

        this.lastState = 0;

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