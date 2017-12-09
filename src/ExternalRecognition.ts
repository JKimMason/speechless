import { Recorder } from 'web-recorder'

import { AbstractRecognition } from './AbstractRecognition'
import { getNavigatorUserMedia } from './utils'

export interface IExternalRecognition extends AbstractRecognition<IExternalRecognitionState> {
  recorder: Recorder
  getRecorder(): Recorder
}

export interface IExternalRecognitionState {
  value?: any
  listening?: boolean
  fetching?: boolean
}

export class ExternalRecognition extends AbstractRecognition<IExternalRecognitionState> {
  public recorder: Recorder
  private speechRecognition: SpeechRecognition
  private audioContext: AudioContext
  private stream: MediaStream

  constructor(lang?: string, private remoteCall?: (blob?: Blob) => Promise<any>) {
    super(lang) /* istanbul ignore next */
    this.setState({
      listening: false,
      fetching: false,
      value: null
    })
    this.onRecordingData = this.onRecordingData.bind(this)
    this.onRecordingStart = this.onRecordingStart.bind(this)
    this.onRecordingStop = this.onRecordingStop.bind(this)
    this.onRemoteResult = this.onRemoteResult.bind(this)
    this.onRecordingEnd = this.onRecordingEnd.bind(this)
    this.onGotStream = this.onGotStream.bind(this)
    return this
  }

  listen(): ExternalRecognition {
    const { listening } = this.getState()
    if (!listening) {
      this.setState({
        value: null
      })
      this.record()
    }

    return this
  }

  kill() {
    this.recorder.abort()
  }

  stop(): ExternalRecognition {
    const { listening } = this.getState()

    if (listening) {
      this.recorder.stop()
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
    this.recorder = new Recorder(stream, {})
    this.recorder.addEventListener('start', this.onRecordingStart)
    this.recorder.addEventListener('end', this.onRecordingEnd)
    this.recorder.addEventListener('stop', this.onRecordingStop)
    this.recorder.addEventListener('data', this.onRecordingData)
    this.recorder.start()
  }

  private onRecordingStart() {
    this.dispatchEvent(new CustomEvent('start'))
    this.setState({
      listening: true
    })
  }
  private onRecordingEnd() {
    const { value } = this.getState()
    this.setState({
      listening: false
    })
    if (this.remoteCall) {
      this.dispatchEvent(new CustomEvent('fetching'))
      this.remoteCall(value).then(this.onRemoteResult)
    }
  }
  private onRecordingStop(ev: Event) {
    const { listening } = this.getState()
    this.dispatchEvent(new CustomEvent('stop'))
    this.setState({
      listening: false
    })
  }

  private onRecordingData(ev: Event): void
  private onRecordingData(ev: CustomEvent): void {
    this.setState({ fetching: true, value: ev.detail })
  }

  private onRemoteResult(res: any): void {
    const { listening } = this.getState()
    this.setState({ value: res, fetching: false })
    this.dispatchEvent(new CustomEvent('data', { detail: res }))
    this.dispatchEvent(new CustomEvent('end'))
  }
}
