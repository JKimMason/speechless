export interface IRecognitionState {
  inputValue: string;
  listening: boolean;
  force: boolean;
}

export interface IRecognitionEventListener extends EventListener {
  (event?: string|void) :any
}

export interface IRecognition extends EventTarget {
  setup(): IRecognition;
  setLang(lang: string): IRecognition;
  listen(): void;
  stop(): void;

  onended:IRecognitionEventListener
  onstoped:IRecognitionEventListener
  onchanged:IRecognitionEventListener
}

export interface IWindow extends Window {
  webkitSpeechRecognition: SpeechRecognitionStatic;
}

function noop(): void {
  return;
}

export class Recognition implements IRecognition {
  private state: IRecognitionState;
  private speechRecognition: SpeechRecognition;
  private listeners: { [key: string]: ()[] };

  constructor(private lang = "en") {
    this.state = {
      listening: false,
      force: false,
      inputValue: ""
    };

    this.onResult = this.onResult.bind(this);
    this.onEnd = this.onEnd.bind(this);
    this.onStart = this.onStart.bind(this);

    this.setup();

    return this;
  }

  static getSpeechRecognition(): SpeechRecognitionStatic {
    const {
      webkitSpeechRecognition: SpeechRecognition
    }: IWindow = window as IWindow;

    return SpeechRecognition;
  }

  static isSupported() {
    return "webkitSpeechRecognition" in window;
  }

  public setup(): Recognition {
    const SpeechRecognition = Recognition.getSpeechRecognition();
    this.speechRecognition = new SpeechRecognition();
    this.speechRecognition.continuous = true;
    this.speechRecognition.interimResults = true;
    this.speechRecognition.lang = this.lang;
    this.speechRecognition.onresult = this.onResult;
    this.speechRecognition.onend = this.onEnd;
    this.speechRecognition.onstart = this.onStart;
    return this;
  }

  public setLang(lang: string): Recognition {
    this.lang = lang;
    return this;
  }

  public listen(): Recognition {
    const { listening } = this.state;
    if (!listening) {
      this.state.inputValue = "";
      this.speechRecognition.start();
    }
    return this;
  }

  public stop(): Recognition {
    const { listening } = this.state;
    if (listening) {
      this.state.force = true;
      this.speechRecognition.stop();
    }
    return this;
  }

  public addEventListener(
    type: string,
    listener?: EventListener | EventListenerObject | undefined,
  ): void {
    if (!(type in this.listeners)) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(listener);
  }

  public dispatchEvent(evt: Event): boolean {
    if (!(event.type in this.listeners)) {
      return true;
    }
    var stack = this.listeners[event.type];

    for (var i = 0, l = stack.length; i < l; i++) {
      stack[i].call(this, event);
    }
    return !event.defaultPrevented;
  }

  public removeEventListener(
    type: string,
    listener?: EventListener | EventListenerObject | undefined,
  ): void {
    if (!(type in this.listeners)) {
      return;
    }
    var stack = this.listeners[type];
    for (var i = 0, l = stack.length; i < l; i++) {
      if (stack[i] === callback) {
        stack.splice(i, 1);
        return;
      }
    }
  }

  private onStart() {
    this.state.listening = true;
  }

  private onChange(interimTranscript: string) {
    this.state.inputValue = interimTranscript;
    this.onChangeCallback(this.state.inputValue);
  }

  private onFinal(finalTranscript: string) {
    this.state.inputValue = finalTranscript;
    this.speechRecognition.stop();
  }

  private onEnd() {
    const { force, inputValue } = this.state;
    this.state.listening = false;
    if (force) {
      this.state.force = false;
      this.onStopCallback();
    } else {
      this.onChangeCallback(inputValue);
      this.onEndCallback(inputValue);
    }
  }

  private onResult(event: SpeechRecognitionEvent) {
    let interimTranscript = "";
    let finalTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
        this.onFinal(finalTranscript);
      } else {
        interimTranscript += event.results[i][0].transcript;
        this.onChange(interimTranscript);
      }
    }
  }
}
