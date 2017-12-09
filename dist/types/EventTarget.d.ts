export declare class EventTarget {
    private eventTarget;
    constructor();
    addEventListener(type: string, listener: EventListener): void;
    removeEventListener(type: string, listener: EventListener): void;
    dispatchEvent(event: Event): boolean;
}
