export interface IRecognitionState {
  inputValue: string;
  listening: boolean;
  force: boolean;
}

export interface IRecognition {
  setup(): IRecognition;
  setLang(lang: string): IRecognition;
  listen(): void;
  stop(): void;
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

  constructor(
    private onChangeCallback: (input?: string) => any = noop,
    private onEndCallback: (input?: string) => any = noop,
    private onStopCallback: () => any = noop,
    private lang: string = "en"
  ) {
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
