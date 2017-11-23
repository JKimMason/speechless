import { AbstractRecognition, IWindow } from './AbstractRecognition'

export interface INativeRecognitionState {
  inputValue: string
  listening: boolean
  force: boolean
}

export class NativeRecognition extends AbstractRecognition {
  private state: INativeRecognitionState
  private speechRecognition: SpeechRecognition

  constructor(lang?: string) {
    super(lang)
    this.state = {
      listening: false,
      force: false,
      inputValue: ''
    }
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

  setup(): this {
    const SpeechRecognition = NativeRecognition.getSpeechRecognition()
    this.speechRecognition = new SpeechRecognition()
    this.speechRecognition.continuous = true
    this.speechRecognition.interimResults = true
    this.speechRecognition.lang = this.getLang()
    this.speechRecognition.onresult = this.onSpeechRecognitionResult
    this.speechRecognition.onend = this.onSpeechRecognitionEnd
    this.speechRecognition.onstart = this.onSpeechRecognitionStart
    return this
  }

  listen(): NativeRecognition {
    const { listening } = this.state
    if (!listening) {
      this.state.inputValue = ''
      this.speechRecognition.start()
    }
    return this
  }

  stop(): NativeRecognition {
    const { listening } = this.state
    if (listening) {
      this.state.force = true
      this.speechRecognition.stop()
    }
    return this
  }

  private onChange(interimTranscript: string) {
    this.state.inputValue = interimTranscript
    const ev = new CustomEvent('changed', { detail: this.state.inputValue })
    this.dispatchEvent(ev)
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
      const evStopped = new CustomEvent('stopped', {
        detail: this.state.inputValue
      })

      this.dispatchEvent(evStopped)
    } else {
      const evChanged = new CustomEvent('changed', { detail: inputValue })
      const evEnded = new CustomEvent('ended', {
        detail: this.state.inputValue
      })

      this.dispatchEvent(evChanged)
      this.dispatchEvent(evEnded)
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
