import { AbstractRecognition, IWindow } from './AbstractRecognition'

export interface INativeRecognitionState {
  value?: string
  listening?: boolean
  force?: boolean
}

export class NativeRecognition extends AbstractRecognition<
  INativeRecognitionState
> {
  private speechRecognition: SpeechRecognition

  constructor(lang?: string) {
    super(lang) /* istanbul ignore next */
    this.setState({
      listening: false,
      force: false,
      value: ''
    })
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
    const { listening } = this.getState()
    if (!listening) {
      this.setState({
        value: ''
      })
      this.speechRecognition.start()
    }
    return this
  }

  stop(): NativeRecognition {
    const { listening } = this.getState()
    if (listening) {
      this.setState({
        force: true
      })
      this.speechRecognition.stop()
    }
    return this
  }

  private onChange(interimTranscript: string) {
    const { value } = this.getState()
    this.setState({
      value: interimTranscript
    })
    this.dispatchEvent(new CustomEvent('data', { detail: interimTranscript }))
  }

  private onFinal(finalTranscript: string) {
    this.setState({
      value: finalTranscript
    })
    this.speechRecognition.stop()
  }

  private onSpeechRecognitionStart() {
    this.setState({
      listening: true
    })
  }

  private onSpeechRecognitionEnd() {
    const { force, value } = this.getState()
    this.setState({
      listening: false
    })
    if (force) {
      this.setState({
        force: false
      })
      this.dispatchEvent(new CustomEvent('stop'))
    } else {
      this.dispatchEvent(new CustomEvent('data', { detail: value }))
      this.dispatchEvent(new CustomEvent('end'))
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
