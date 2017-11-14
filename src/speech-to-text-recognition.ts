import { Event } from '_debugger'

export interface IRecognitionState {
  inputValue: string
  listening: boolean
  force: boolean
}

export interface IRecognitionEvent {
  type: 'changed' | 'ended' | 'stopped'
  body?: string
}

export interface IRecognitionEventListener {
  (event?: IRecognitionEvent): any
}

export interface IRecognition {
  setup(): IRecognition
  setLang(lang: string): IRecognition
  listen(): void
  stop(): void

  addEventListener(type: string, listener: IRecognitionEventListener): void
  dispatchEvent(event: IRecognitionEvent): boolean
  removeEventListener(type: string, listener: IRecognitionEventListener): void
  // onended(): IRecognitionEventListener;
  // onstopped(): IRecognitionEventListener;
  // onchanged(): IRecognitionEventListener;
}

export interface IWindow extends Window {
  webkitSpeechRecognition: SpeechRecognitionStatic
}

export class Recognition implements IRecognition {
  private state: IRecognitionState
  private speechRecognition: SpeechRecognition
  private listeners: {
    [key: string]: IRecognitionEventListener[]
  }

  constructor(private lang = 'en') {
    this.state = {
      listening: false,
      force: false,
      inputValue: ''
    }
    this.listeners = {}
    this.onSpeechRecognitionResult = this.onSpeechRecognitionResult.bind(this)
    this.onSpeechRecognitionEnd = this.onSpeechRecognitionEnd.bind(this)
    this.onSpeechRecognitionStart = this.onSpeechRecognitionStart.bind(this)

    this.setup()

    return this
  }

  static getSpeechRecognition(): SpeechRecognitionStatic {
    const {
      webkitSpeechRecognition: SpeechRecognition
    }: IWindow = window as IWindow

    return SpeechRecognition
  }

  static isSupported() {
    return 'webkitSpeechRecognition' in window
  }

  public addEventListener(
    type: 'changed' | 'ended' | 'stopped',
    listener: IRecognitionEventListener
  ): void {
    this.listeners[type] = this.listeners[type] || []
    this.listeners[type].push(listener)
  }

  public dispatchEvent(event: IRecognitionEvent): boolean {
    if (!(event.type in this.listeners)) {
      return true
    }
    this.listeners[event.type].forEach(callback => {
      callback.call(this, event)
    })
    return true
  }

  public removeEventListener(
    type: 'changed' | 'ended' | 'stopped',
    listener: IRecognitionEventListener
  ): void {
    if (!(type in this.listeners)) {
      return
    }
    this.listeners[type] = this.listeners[type].filter(
      callback => callback !== listener
    )
  }

  public setup(): Recognition {
    const SpeechRecognition = Recognition.getSpeechRecognition()
    this.speechRecognition = new SpeechRecognition()
    this.speechRecognition.continuous = true
    this.speechRecognition.interimResults = true
    this.speechRecognition.lang = this.lang
    this.speechRecognition.onresult = this.onSpeechRecognitionResult
    this.speechRecognition.onend = this.onSpeechRecognitionEnd
    this.speechRecognition.onstart = this.onSpeechRecognitionStart
    return this
  }

  public setLang(lang: string): Recognition {
    this.lang = lang
    return this
  }

  public listen(): Recognition {
    const { listening } = this.state
    if (!listening) {
      this.state.inputValue = ''
      this.speechRecognition.start()
    }
    return this
  }

  public stop(): Recognition {
    const { listening } = this.state
    if (listening) {
      this.state.force = true
      this.speechRecognition.stop()
    }
    return this
  }

  private onChange(interimTranscript: string) {
    this.state.inputValue = interimTranscript
    this.dispatchEvent({ type: 'changed', body: this.state.inputValue })
  }

  private onFinal(finalTranscript: string) {
    this.state.inputValue = finalTranscript
    this.speechRecognition.stop()
  }

  private onSpeechRecognitionStart() {
    this.state.listening = true
  }

  private onSpeechRecognitionEnd() {
    const { force, inputValue } = this.state
    this.state.listening = false
    if (force) {
      this.state.force = false
      this.dispatchEvent({ type: 'stopped', body: inputValue })
    } else {
      this.dispatchEvent({ type: 'changed', body: inputValue })
      this.dispatchEvent({ type: 'ended', body: inputValue })
    }
  }

  private onSpeechRecognitionResult(event: SpeechRecognitionEvent) {
    let interimTranscript = ''
    let finalTranscript = ''
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript
        this.onFinal(finalTranscript)
      } else {
        interimTranscript += event.results[i][0].transcript
        this.onChange(interimTranscript)
      }
    }
  }
}
