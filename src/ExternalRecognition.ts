import { Recorder } from '../test/__mocks__/Recorder'

import { AbstractRecognition } from './AbstractRecognition'

export interface IExternalRecognitionState {
  inputValue: string
  recording: boolean
  force: boolean
}

export class ExternalRecognition extends AbstractRecognition {
  private speechRecognition: SpeechRecognition
  private state: IExternalRecognitionState
  private audioContext: AudioContext
  private audioRecorder: any
  constructor(lang?: string) {
    super(lang)
    this.state = {
      recording: false,
      force: false,
      inputValue: ''
    }
    this.onSpeechRecognitionEnd = this.onSpeechRecognitionEnd.bind(this)
    this.onSpeechRecognitionStart = this.onSpeechRecognitionStart.bind(this)
    this.onGotStream = this.onGotStream.bind(this)
    return this
  }

  getNavigatorUserMedia(
    constraints: MediaStreamConstraints,
    successCallback: NavigatorUserMediaSuccessCallback,
    errorCallback: NavigatorUserMediaErrorCallback
  ): void {
    const navigator = window.navigator
    const navigatorAsAny = window.navigator as any
    if (navigator.getUserMedia) {
      navigator.getUserMedia(constraints, successCallback, errorCallback)
    } else if (navigatorAsAny.webkitGetUserMedia) {
      navigatorAsAny.webkitGetUserMedia(
        constraints,
        successCallback,
        errorCallback
      )
    } else if (navigatorAsAny.mozGetUserMedia) {
      navigatorAsAny.mozGetUserMedia(
        constraints,
        successCallback,
        errorCallback
      )
    } else if (
      navigatorAsAny.mediaDevices &&
      navigatorAsAny.mediaDevices.getUserMedia
    ) {
      navigatorAsAny.mediaDevices.getUserMedia(
        constraints,
        successCallback,
        errorCallback
      )
    } else {
      throw new Error('no userMedia support')
    }
  }
  startRecording() {
    this.getNavigatorUserMedia(
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
      this.audioRecorder.stop()
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
      const evStopped = new CustomEvent('stopped', { detail: inputValue })
      this.dispatchEvent(evStopped)
    } else {
      const evChanged = new CustomEvent('changed', { detail: inputValue })
      const evEnded = new CustomEvent('ended', { detail: inputValue })
      this.dispatchEvent(evChanged)
      this.dispatchEvent(evEnded)
    }
  }
}
