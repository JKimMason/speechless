import { Recorder } from 'web-recorder'

import { AbstractRecognition } from './AbstractRecognition'
import { getNavigatorUserMedia } from './utils'

export interface IExternalRecognitionState {
  value?: any
  listening?: boolean
  fetching?: boolean
  force?: boolean
}

export class ExternalRecognition extends AbstractRecognition<
  IExternalRecognitionState
> {
  public recorder: Recorder
  private speechRecognition: SpeechRecognition
  private audioContext: AudioContext
  private stream: MediaStream

  constructor(
    lang?: string,
    private remoteCall?: (blob?: Blob) => Promise<any>
  ) {
    super(lang) /* istanbul ignore next */
    this.setState({
      listening: false,
      force: false,
      fetching: false,
      value: null
    })
    this.onRecordingData = this.onRecordingData.bind(this)
    this.onRecordingStart = this.onRecordingStart.bind(this)
    this.onRecordingStop = this.onRecordingStop.bind(this)
    this.onRemoteResult = this.onRemoteResult.bind(this)
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

  stop(): ExternalRecognition {
    const { listening } = this.getState()

    if (listening) {
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
      listening: true
    })
  }

  private onRecordingStop() {
    const { force, listening } = this.getState()

    this.stream.getTracks().forEach((mediaStreamTrack: MediaStreamTrack) => {
      mediaStreamTrack.stop()
    })

    if (force) {
      this.dispatchEvent(new CustomEvent('stop'))
    } else {
      this.dispatchEvent(new CustomEvent('end'))
    }
    this.setState({
      listening: false,
      force: false
    })
  }

  private onRecordingData(ev: Event): void
  private onRecordingData(ev: CustomEvent): void {
    if (this.remoteCall) {
      this.setState({ fetching: true })
      this.dispatchEvent(new CustomEvent('fetching'))
      this.remoteCall(ev.detail).then(this.onRemoteResult)
    }
  }

  private onRemoteResult(res: any): void {
    this.setState({ value: res, fetching: false })
    this.dispatchEvent(new CustomEvent('data', { detail: res }))
  }
}
