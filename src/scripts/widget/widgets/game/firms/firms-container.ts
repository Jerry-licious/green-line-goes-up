import {Game} from '../game';
import {Firm} from '../../../../simulation/actors/firm';
import {FirmWidget} from './firm-widget';
import {Div} from '../../../builders/common-elements';
import {ElementBuilder} from '../../../builders/element-builder';
import {GameWidget} from '../game-widget';

export class FirmsContainer extends GameWidget<null>{
    firms: Firm[];
    firmWidgets: FirmWidget[] = [];

    firmContainer: Element = Div.simple('', ['factories']).build();

    constructor(game: Game, firms: Firm[],
                // Whether new firms can be created within this container.
                addButton: boolean) {
        super(game, 'div', 'factories-container');

        this.firms = firms;

        this.domElement.append(
            this.firmContainer,
            ...addButton ? [new ElementBuilder({
                tag: 'button',
                styleClasses: ['add', 'primary', 'material-icons']
            }).build()] : []
        );

        this.updateWidgetList();
    }

    // The firms list is a reference, and can be changed over time.
    updateWidgetList() {
        // Filter for firms not included in the widget list.
        this.firms.filter((firm) => this.firmWidgets.map((widget) => widget.firm)
            .every((widgetFirm) => firm != widgetFirm))
            // Create new firm widgets for them and add it to the container.
            .forEach((newFirm) => {
                let newFirmWidget = new FirmWidget(newFirm, this.game);

                this.firmWidgets.push(newFirmWidget);
                this.firmContainer.append(newFirmWidget.domElement);
            });
    }

    updateElement(state: null | undefined): void {}

    gameTick() {
        for (let widget of this.firmWidgets) {
            widget.gameTick();
        }
    }
}