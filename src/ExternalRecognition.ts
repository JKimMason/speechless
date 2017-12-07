import { Recorder } from 'web-recorder'

import { AbstractRecognition } from './AbstractRecognition'

export interface IExternalRecognitionState {
  inputValue?: string
  recording?: boolean
  force?: boolean
}

export class ExternalRecognition extends AbstractRecognition<
  IExternalRecognitionState
> {
  public recorder: Recorder
  private speechRecognition: SpeechRecognition
  private audioContext: AudioContext
  private stream: MediaStream

  constructor(lang?: string) {
    super(lang)
    this.setState({
      recording: false,
      force: false,
      inputValue: ''
    })
    this.onRecordingData = this.onRecordingData.bind(this)
    this.onRecordingStart = this.onRecordingStart.bind(this)
    this.onRecordingStop = this.onRecordingStop.bind(this)
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
    this.stream = stream
    this.recorder = new Recorder(stream)
    this.recorder.addEventListener('start', this.onRecordingStart)
    this.recorder.addEventListener('stop', this.onRecordingStop)
    this.recorder.addEventListener('data', this.onRecordingData)

    this.recorder.start()
  }

  listen(): ExternalRecognition {
    const { recording } = this.getState()
    if (!recording) {
      this.setState({
        inputValue: ''
      })
      this.startRecording()
    }
    return this
  }

  stop(): ExternalRecognition {
    const { recording } = this.getState()

    if (recording) {
      this.setState({
        force: true
      })
      this.recorder.reset()
      this.recorder.abort()
    }
    return this
  }

  private onRecordingStart() {
    this.setState({
      recording: true
    })
  }

  private onRecordingStop() {
    const { force, recording } = this.getState()
    try {
      this.stream.getTracks().forEach((mediaStreamTrack: MediaStreamTrack) => {
        mediaStreamTrack.stop()
      })
    } catch (e) {
      console.error(e)
    }
    if (force) {
      this.dispatchEvent(new CustomEvent('stop'))
    } else {
      this.dispatchEvent(new CustomEvent('end'))
    }
    this.setState({
      recording: false,
      force: false
    })
  }

  private onRecordingData(ev: Event): void
  private onRecordingData(ev: CustomEvent): void {
    this.setState({ inputValue: ev.detail })
    this.dispatchEvent(ev)
  }
}
