import { AudioContext } from 'standardized-audio-context-mock'
import { MediaStreamAudioSourceNodeMock } from './MediaStreamAudioSourceNode'

export class AudioContextMock extends AudioContext {
  constructor() {
    super()
  }
  createMediaStreamSource(
    mediaStream: MediaStream
  ): MediaStreamAudioSourceNodeMock {
    return new MediaStreamAudioSourceNodeMock()
  }
}