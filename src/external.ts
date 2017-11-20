const Worker = require('worker-loader!./Worker')

import { AbstractRecognition } from './index'

export interface IExternalRecognitionState {
  inputValue: string
  recording: boolean
  force: boolean
}

export default class ExternalRecognition extends AbstractRecognition {
  private speechRecognition: SpeechRecognition
  private state: IExternalRecognitionState
  private audioContext: AudioContext
  private audioRecorder: any
  private worker: Worker
  constructor() {
    super()
    this.state = {
      recording: false,
      force: false,
      inputValue: ''
    }
    this.worker = Worker()
    this.onSpeechRecognitionEnd = this.onSpeechRecognitionEnd.bind(this)
    this.onSpeechRecognitionStart = this.onSpeechRecognitionStart.bind(this)
    this.onGotStream = this.onGotStream.bind(this)

    return this
  }
  setup(): this {
    this.setupNavigator()
    return this
  }
  setupNavigator(): Navigator {
    if (!(navigator as any).getUserMedia) {
      ;(navigator as any).getUserMedia =
        (navigator as any).webkitGetUserMedia ||
        (navigator as any).mozGetUserMedia ||
        (navigator as any).mediaDevices.getUserMedia
    }

    return navigator as Navigator
  }
  startRecording() {
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
      this.onGotStream,
      console.error
    )
  }
  onGotStream(stream: MediaStream) {
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

  listen(): ExternalRecognition {
    const { recording } = this.state
    if (!recording) {
      this.state.inputValue = ''
      this.state.recording = true
      this.startRecording()
    }
    return this
  }

  stop(): ExternalRecognition {
    const { recording } = this.state
    if (recording) {
      this.state.force = true
      this.speechRecognition.stop()
    }
    return this
  }

  private onSpeechRecognitionStart() {
    this.state.recording = true
  }

  private onSpeechRecognitionEnd() {
    const { force, inputValue } = this.state
    this.state.recording = false
    if (force) {
      this.state.force = false
      this.dispatchEvent({ type: 'stopped', body: inputValue })
    } else {
      this.dispatchEvent({ type: 'changed', body: inputValue })
      this.dispatchEvent({ type: 'ended', body: inputValue })
    }
  }
}
