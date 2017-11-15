import Recorder from './recorder'

export interface IRecognitionState {
  inputValue: string
  listening: boolean
  force: boolean
}

export interface IRecognitionMap {
  changed: IRecognitionEvent
  ended: IRecognitionEvent
  stopped: IRecognitionEvent
  recording: IRecognitionEvent
  sending: IRecognitionEvent
}

export interface IRecognitionEvent {
  type: string
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
  addEventListener<K extends keyof IRecognitionMap>(
    type: K,
    listener: IRecognitionEventListener
  ): void
  removeEventListener<K extends keyof IRecognitionMap>(
    type: K,
    listener: IRecognitionEventListener
  ): void
  dispatchEvent(event: IRecognitionEvent): boolean
  // onended(): IRecognitionEventListener;
  // onstopped(): IRecognitionEventListener;
  // onchanged(): IRecognitionEventListener;
}

export interface IWindow extends Window {
  webkitSpeechRecognition: SpeechRecognitionStatic
}

export default class Recognition implements IRecognition {
  private state: IRecognitionState
  private speechRecognition: SpeechRecognition
  private listeners: {
    [key: string]: IRecognitionEventListener[]
  }
  private audioContext: AudioContext
  private audioRecorder: any

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
    this.gotStream = this.gotStream.bind(this)

    this.setup()
    this.startRecording()
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

  getNavigator(): Navigator {
    if (!(navigator as any).getUserMedia) {
      ;(navigator as any).getUserMedia =
        (navigator as any).webkitGetUserMedia ||
        (navigator as any).mozGetUserMedia ||
        (navigator as any).mediaDevices.getUserMedia
    }

    return navigator as Navigator
  }
  startRecording() {
    const navigator = this.getNavigator()
    navigator.getUserMedia(
      {
        audio: {
          advanced: [
            {
              echoCancelation: false
            }
          ]
        }
      },
      this.gotStream,
      console.error
    )
  }
  gotStream(stream: MediaStream) {
    this.audioContext = this.audioContext || new AudioContext()

    const inputPoint = this.audioContext.createGain()
    // Create an AudioNode from the stream.
    const realAudioInput = this.audioContext.createMediaStreamSource(stream)
    const audioInput = realAudioInput
    audioInput.connect(inputPoint)

    const analyserNode = this.audioContext.createAnalyser()
    analyserNode.fftSize = 2048
    inputPoint.connect(analyserNode)
    // Direclty from window.Recorder
    this.audioRecorder = new Recorder(inputPoint)
    const zeroGain = this.audioContext.createGain()
    zeroGain.gain.value = 0.0
    inputPoint.connect(zeroGain)
    zeroGain.connect(this.audioContext.destination)
    this.audioRecorder.record()
  }

  public addEventListener<K extends keyof IRecognitionMap>(
    type: K,
    listener: IRecognitionEventListener
  ): void {
    this.listeners[type] = this.listeners[type] || []
    this.listeners[type].push(listener)
  }

  public removeEventListener<K extends keyof IRecognitionMap>(
    type: K,
    listener: IRecognitionEventListener
  ): void {
    if (!(type in this.listeners)) {
      return
    }
    this.listeners[type] = this.listeners[type].filter(
      callback => callback !== listener
    )
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
