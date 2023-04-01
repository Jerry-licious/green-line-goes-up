import {Widget} from '../../../widget';
import {TimeControl} from './time-control';

export class TimeControlButton extends Widget<boolean> {
    index: number;
    timeControl: TimeControl;

    constructor(icon: string, index: number, timeControl: TimeControl) {
        super('button', 'primary-container', 'material-icons');

        this.domElement.append(icon);

        this.index = index;
        this.timeControl = timeControl;

        this.domElement.addEventListener('click', function () {
            timeControl.updateElement(index);
        });
    }

    updateElement(state: boolean): void {
        // I know that ternary is cleaner, this is clearer.
        if (state) {
            this.domElement.classList.remove('primary-container');
            this.domElement.classList.add('primary');
        } else {
            this.domElement.classList.add('primary-container');
            this.domElement.classList.remove('primary');
        }
    }
}