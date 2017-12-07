import { Recorder } from 'web-recorder'

import { AbstractRecognition } from './AbstractRecognition'
import { getNavigatorUserMedia } from './utils'

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
    super(lang) /* istanbul ignore next */
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

  listen(): ExternalRecognition {
    const { recording } = this.getState()
    if (!recording) {
      this.setState({
        inputValue: ''
      })
      this.record()
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

  getRecorder() {
    return this.recorder
  }

  private record() {
    getNavigatorUserMedia(
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

  private onGotStream(stream: MediaStream) {
    this.stream = stream
    this.recorder = new Recorder(stream)
    this.recorder.addEventListener('start', this.onRecordingStart)
    this.recorder.addEventListener('stop', this.onRecordingStop)
    this.recorder.addEventListener('data', this.onRecordingData)

    this.recorder.start()
  }

  private onRecordingStart() {
    this.setState({
      recording: true
    })
  }

  private onRecordingStop() {
    const { force, recording } = this.getState()

    this.stream.getTracks().forEach((mediaStreamTrack: MediaStreamTrack) => {
      mediaStreamTrack.stop()
    })

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
