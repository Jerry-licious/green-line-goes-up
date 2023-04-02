import {GameWidget} from '../game-widget';
import {Game} from '../game';
import {Div, GameIcon} from '../../../builders/common-elements';

export class FactorsOfProductionWidget extends GameWidget<null> {
    labourProgress = (Div.simple('', ['progress']).build() as HTMLElement);
    resourcesProgress = (Div.simple('', ['progress']).build() as HTMLElement);
    physicalCapitalProgress = (Div.simple('', ['progress']).build() as HTMLElement);
    humanCapitalProgress = (Div.simple('', ['progress']).build() as HTMLElement);
    technologyProgress = (Div.simple('', ['progress']).build() as HTMLElement);

    constructor(game: Game) {
        super(game, 'div', 'factors');

        console.log("HELLO?")
        this.domElement.append(
            Div.simple('Factors of Production', ['title']).build(),
            new Div({
                styleClasses: ['list'],
                children: [
                    new Div({
                        styleClasses: ['entry'],
                        children: [
                            new GameIcon('population').build(),
                            new Div({
                                styleClasses: ['progress-bar'],
                                children: [ this.labourProgress ]
                            }).build()
                        ]
                    }).build(),
                    new Div({
                        styleClasses: ['entry'],
                        children: [
                            new GameIcon('resources').build(),
                            new Div({
                                styleClasses: ['progress-bar'],
                                children: [ this.resourcesProgress ]
                            }).build()
                        ]
                    }).build(),
                    new Div({
                        styleClasses: ['entry'],
                        children: [
                            new GameIcon('factory').build(),
                            new Div({
                                styleClasses: ['progress-bar'],
                                children: [ this.physicalCapitalProgress ]
                            }).build()
                        ]
                    }).build(),
                    new Div({
                        styleClasses: ['entry'],
                        children: [
                            new GameIcon('assembly').build(),
                            new Div({
                                styleClasses: ['progress-bar'],
                                children: [ this.humanCapitalProgress ]
                            }).build()
                        ]
                    }).build(),
                    new Div({
                        styleClasses: ['entry'],
                        children: [
                            new GameIcon('technology').build(),
                            new Div({
                                styleClasses: ['progress-bar'],
                                children: [ this.technologyProgress ]
                            }).build()
                        ]
                    }).build()
                ]
            }).build()
        )
    }

    gameTick(): void {
        this.labourProgress.style.width = this.calculateWidth(this.game.simulation.labourFactor);
        this.resourcesProgress.style.width = this.calculateWidth(this.game.simulation.resourcesFactor);
        this.physicalCapitalProgress.style.width = this.calculateWidth(this.game.simulation.physicalCapitalFactor);
        this.humanCapitalProgress.style.width = this.calculateWidth(this.game.simulation.humanCapitalFactor);
        this.technologyProgress.style.width = this.calculateWidth(this.game.simulation.technologyFactor);
    }

    calculateWidth(factor: number) {
        return `${factor * 95 + 5}%`;
    }

    updateElement(state: null | undefined): void {}
}