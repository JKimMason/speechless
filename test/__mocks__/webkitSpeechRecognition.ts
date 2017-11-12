export interface SpeechRecognitionEventMock
  extends SpeechRecognitionEvent,
    CustomEvent {}

export interface SpeechRecognitionStaticMock {
  prototype: SpeechRecognitionMock;
  new (): SpeechRecognitionMock;
}
export class SpeechRecognitionMock implements SpeechRecognition {
  public grammars: SpeechGrammarList;
  public lang: string;
  public continuous: boolean;
  public interimResults: boolean;
  public maxAlternatives: number;
  public serviceURI: string;

  public onaudiostart: (ev: Event) => any;
  public onsoundstart: (ev: Event) => any;
  public onspeechstart: (ev: Event) => any;
  public onspeechend: (ev: Event) => any;
  public onsoundend: (ev: Event) => any;
  public onresult: (ev: SpeechRecognitionEvent) => any;
  public onnomatch: (ev: SpeechRecognitionEvent) => any;
  public onerror: (ev: SpeechRecognitionError) => any;
  public onstart: (ev: Event) => any;
  public onend: (ev: Event) => any;

  public started: boolean;

  addEventListener(
    type: string,
    listener?: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void {
    return;
  }
  dispatchEvent(evt: Event): boolean {
    return;
  }
  removeEventListener(
    type: string,
    listener?: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void {
    return;
  }

  start(): void {
    if (this.started) {
      throw new DOMException(
        "Failed to execute 'start' on 'SpeechRecognition': recognition has already started."
      );
    }
    this.started = true;
    // Create and dispatch an event
    const event = document.createEvent("CustomEvent");
    this.onstart(event);
  }
  stop(): void {
    this.abort();
  }
  abort(): void {
    if (!this.started) {
      return;
    }
    this.started = false;
    // Create and dispatch an event
    const event = document.createEvent("CustomEvent");
    event.initCustomEvent("end", false, false, null);

    this.onend(event);
  }
  say(results: SpeechRecognitionResultList, resultIndex: number = 0) {
    // Create the event
    const event = document.createEvent(
      "CustomEvent"
    ) as SpeechRecognitionEventMock;
    event.initCustomEvent("result", false, false, {});
    event.resultIndex = resultIndex;
    event.results = results;
    event.interpretation = null;
    event.emma = null;
    this.onresult(event);
  }
}
