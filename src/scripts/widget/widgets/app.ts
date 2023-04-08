import {Widget} from './widget';
import {MainMenu} from './main-menu';
import {Game} from './game/game';
import {InfoPanel} from './info-panel';

export class App extends Widget<null> {
    mainMenu = new MainMenu(this);
    concepts = new InfoPanel(this,
        ['img/concepts/1.png', 'img/concepts/2.png', 'img/concepts/3.png', 'img/concepts/4.png', 'img/concepts/5.png', 'img/concepts/6.png', 'img/concepts/7.png'],
        [
            'Fruit of Labour',
            'Make Them Happy',
            'Market Economy',
            'Human Capital',
            'Firms',
            'Circular Flow',
            'GDP'
        ],
        [
            `Say hello to our economic actor, the fruit of labour! In the simulation, the fruit of labour represents an individual person, and there are a total of 100 fruits to represent a small population. Each person likes to consume goods and would want to spend money to get them. When they consume something, they gain what's called "utility", the economist's way of quantifying happiness. It's generally assumed that the more things someone consumes, the happier they get. Whether that's true is up to debate, but it's true for our little fruits. There are two basic rules: the more the better, and the more varied and different the better.`,
            `In the simulation, you will see that a fruit could be struggling if it doesn't earn enough of an income to buy goods that make it happy. It could be living at subsistence level if it earns just enough money to buy some basic goods every day. However, if you, the government, do a really good job at developing the economy, our fruits of labour will turn golden to show that they are living the time of their lives. `,
            `Our simulation is organised through markets. Each fruit keeps track of the price of their favourite goods, and, every day, considers if it's worth buying something. If lots of fruits want the same thing and are willing to pay big money for it, then its price would go up. If nobody wants something, its price will plummet. Eventually, everybody settles on some kind of spending habit and prices stabilise. You, as the government, have the ability to buy from the market as well. However, money you spend is printed, meaning that everything you buy will inflate the prices. Spend wisely!`,
            `Each fruit at birth is gifted with a kind of talent, the ability to produce a certain kind of labour more efficiently than the others. There are six types of labour: mining, artisan, forestry, farming, assembly, and technical, each with their own applications. However, no matter how talented a fruit is, if no one is willing to employ it, then it has to work somewhere else. Make sure to diversify the economy so everyone can work their favourite jobs!`,
            `How do things get made? Firms serve as a vital part of the economy that transforms labour into goods. Take a forest for example, we may employ fruits and get some forestry labour to obtain some wood as a result. All goods in the economy are produced by firms, and it is your job, as the government, to build them one by one. In addition, firms can become more efficient by receiving upgrades. By providing firms with advanced tools, you can double their productivity with every upgrade, freeing up fruits to work on other things while producing more! Sometimes, firms may struggle and cannot afford their inputs, as the government can help them out in the short-term by supplying their goods, but in the long run a failing firm will stay a failing firm.`,
            `In the simulation, a "cycle" is our basic unit of time. In every cycle, our fruits pick their jobs and sell their labour to firms. Firms in term use their labour to produce goods, and sell the goods back to the fruits. The fruits pay money for the goods, and firms pay this money back to the fruits as a wage. This beautiful cycle will keep the economy running as money and goods swap between individuals and firms.`,
            `The Gross Domestic Product (GDP), is the total value of everything your simulation produces in a period of time, in this case every cycle. Your job as the government is to make this line go up, by constructing and upgrading firms, and producing more and better things over time. To help you out, every cycle you will be awarded a portion of your GDP as your credit. Spend credits to print money and buy things from the market. While prices will go up in the long run, you will be able to increase the productivity of the economy meanwhile, and make everyone's lives better!`
        ]
    );
    tutorial = new InfoPanel(this,
        ['img/tutorial/1.png', 'img/tutorial/2.png', 'img/tutorial/3.png', 'img/tutorial/4.png', 'img/tutorial/5.png', 'img/tutorial/6.png', 'img/tutorial/7.png', 'img/tutorial/8.png', 'img/tutorial/9.png'],
        [
            'Time',
            'Favourites',
            'Markets',
            'Crowding Out',
            'Labour Shortage',
            'Upgrades',
            'Spending',
            'Construction',
            'Demand'
        ],
        [
            `On the top-right corner of the game, you can control its speed and pause it at will. When the simulation starts, it takes a few hundred cycles before people find their jobs and things reach their first equilibrium, so it's recommended to start at the maximum speed. Generally, when playing around with the market, it's a good idea to run at slow speed so you can monitor the price. `,
            `Each fruit also has their favourite things to consume. When you hover over a fruit, you will see their top three goods, and their current job. `,
            `Buying things from the markets tab is one of the primary ways you can interact with the simulation. By selecting a market from the list, you can place orders for a specific good. The game will show your current inventory, the amount of things you have ordered but have not been sold to you, and the estimated cost of your purchase. In some markets, where there is no natural demand, the estimated cost will be 0. In that case, your orders will continuously raise the price until people are willing to sell them. There is a maximum amount of government purchases per day to prevent markets from being excessively flooded. `,
            `Whenever you buy things from the market, the economy has to produce things not for consumption but for your needs. People and firms who would be producing goods will be working for you. This is known as the Crowding Out effect. In addition, fluctuating prices combined with Crowding Out means that firms may sometimes fail to afford their inputs, and have to cut costs, which lowers their income, makes them not able to afford inputs, and cut costs in a downward spiral. You will see this as a fluctuating capacity with a blinking danger sign. Normally, firms would borrow some money from banks or investors to get through this, but in the game you are responsible for fixing them. Help the firm recover by providing them with their inputs. After a few rounds of subsidies, the firm will resume its function. `,
            `Sometimes, multiple firms fluctuate in capacity. This means that they are competing against each other for a limited good, usually labour. Since there are only so many people in the simulation, labour is scarce. As you build more firms, upgrading existing firms will boost their productivity by increasing the output and reducing the labour requirement, which frees up labour to work in other firms.`,
            `You can spend basic, industrial, or advanced tools to upgrade a firm, which will roughly decrease its labour requirement by 40%, increase its output by 60%, at the cost of consuming coal for industrial firms and electricity for advanced firms. Each firm can be upgraded up to four times. However some firms, like artisan workshops that involve irreplaceable manual labour cannot be upgraded, and some advanced firms such as the solar plant start with upgrades.`,
            `Constructing, upgrading, or subsidising firms require goods. When you try to perform one such action, the game will show your current inventory, and your new inventory after subtracting the cost, with red representing insufficient goods. For example, upgrading a firm to basic tier requires 250 basic tools, and with 100 in your inventory, you will be missing 150 tools necessary for the action. Buy goods from the market to add to your inventory.`,
            `In the beginning of the game, most goods are not available as there is no firm that produces them. If you need a good that is not sold on the market, you have to construct a firm that produces it. To do this, go to the resources or factories tab and click on the plus button on the bottom-right, which lets you browse a list of firms available for construction. Clicking on build will allow you to create a firm that produces a specific good.`,
            `When you open the technology tab, you will see a list of goods, with the ones you currently produce coloured in green. If you hover over any good, you can see its base value, which is on average how an individual values it. A good is a consumer good if it has a base value of more than 0, meaning that people are willing to buy it, and an industrial or intermediate good if it has a base value of 0, meaning that only firms and governments may want them. When a firm’s output has no demand because nobody wants it, you will see a danger sign. Construct firms that provide high value consumer goods to boost the economy!`
        ]
    );
    game = new Game();

    constructor() {
        super('div', 'app');

        this.domElement.append(this.mainMenu.domElement);
    }

    play() {
        this.clearElement();
        this.domElement.append(this.game.domElement);
    }

    openConceptsPanel() {
        this.clearElement();
        this.domElement.append(this.concepts.domElement);
    }

    openTutorialPanel() {
        this.clearElement();
        this.domElement.append(this.tutorial.domElement);
    }

    menu() {
        this.clearElement();
        this.domElement.append(this.mainMenu.domElement);
    }

    updateElement(state: null | undefined): void {}
}