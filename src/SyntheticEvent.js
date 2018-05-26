const EVENT_PROPS = [
    'target',
    'bubbles',
];

export class SyntheticEvent {
    constructor(event) {
        if (event instanceof SyntheticEvent) {
            return event;
        }

        this.domEvent = event;
    
        EVENT_PROPS
            .forEach(propKey => {
                this[propKey] = event[propKey];
            });
    }

    preventDefault() {
        this.domEvent.preventDefault();
    }

    stopPropagation() {
        this.domEvent.stopPropagation();
    }   
}
