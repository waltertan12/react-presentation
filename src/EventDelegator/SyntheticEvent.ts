export class SyntheticEvent<T = Element, E = Event> {
    // @ts-ignore
    nativeEvent: E & Event;
    // @ts-ignore
    target: (T & EventTarget | null);
    bubbles: boolean = true;

    constructor(event: (E & Event) | SyntheticEvent<T, E>) {
        if (event instanceof SyntheticEvent) {
            return event;
        }

        this.nativeEvent = event;
        this.target = event.target as (T & EventTarget) | null;
        this.bubbles = event.bubbles;
    }

    preventDefault() {
        this.nativeEvent?.preventDefault();
    }

    stopPropagation() {
        this.nativeEvent?.stopPropagation();
    }
}
