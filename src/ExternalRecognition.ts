import { Recorder } from 'web-recorder'

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
  private stream: MediaStream

  constructor(lang?: string) {
    super(lang)
    this.state = {
      recording: false,
      force: false,
      inputValue: ''
    }
    this.onRecordingData = this.onRecordingData.bind(this)
    this.onRecordingStart = this.onRecordingStart.bind(this)
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
    this.audioRecorder = new Recorder(stream)
    this.audioRecorder.addEventListener('start', this.onRecordingStart)
    this.audioRecorder.addEventListener('stpo', this.onRecordingStop)
    this.audioRecorder.addEventListener('data', this.onRecordingData)

    this.audioRecorder.start()
  }

  listen(): ExternalRecognition {
    const { recording } = this.state
    if (!recording) {
      this.state.inputValue = ''
      this.startRecording()
    }
    return this
  }

  stop(): ExternalRecognition {
    const { recording } = this.state
    if (recording) {
      this.state.force = true
      this.audioRecorder.reset()

      this.audioRecorder.stop()
    }
    return this
  }

  private onRecordingStart() {
    this.state.recording = true
  }

  private onRecordingStop() {
    this.state.recording = false
    this.state.force = false

    this.dispatchEvent(new CustomEvent('stop'))
  }

  private onRecordingData() {
    const { force, inputValue } = this.state
    this.state.recording = false
    this.stream.getTracks().forEach((mediaStreamTrack: MediaStreamTrack) => {
      mediaStreamTrack.stop()
    })
    if (force) {
      this.state.force = false
      this.dispatchEvent(new CustomEvent('stop'))
    } else {
      this.dispatchEvent(new CustomEvent('data', { detail: inputValue }))
      this.dispatchEvent(new CustomEvent('end'))
    }
  }
}
