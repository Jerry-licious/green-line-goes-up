import {GameWidget} from '../game-widget';
import {Game} from '../game';
import {IndividualWidget} from './individual-widget';

export class PopulationWidget extends GameWidget<null> {
    individualWidgets: IndividualWidget[] = [];

    constructor(game: Game) {
        super(game, 'div', 'population');
    }

    gameTick(): void {
        // Add individuals that haven't been included yet.
        this.game.simulation.individuals.filter((individual) =>
            !this.individualWidgets.some((widget) => widget.individual == individual))
            .forEach((newIndividual) => {
                let newWidget = new IndividualWidget(this.game, newIndividual);

                this.individualWidgets.push(newWidget);
                this.domElement.append(newWidget.domElement);
            });

        for (let widget of this.individualWidgets) {
            widget.gameTick();
        }
    }

    updateElement(state: null | undefined): void {}
}