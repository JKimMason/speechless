import { MediaStreamTrackMock } from './MediaStreamTrackMock'

export class MediaStreamMock implements MediaStream {
  active: boolean
  id: string
  onactive: (this: MediaStream, ev: Event) => any
  onaddtrack: (this: MediaStream, ev: MediaStreamTrackEvent) => any
  oninactive: (this: MediaStream, ev: Event) => any
  onremovetrack: (this: MediaStream, ev: MediaStreamTrackEvent) => any
  addTrack(track: MediaStreamTrack): void {
    throw new Error('Method not implemented.')
  }
  clone(): MediaStream {
    throw new Error('Method not implemented.')
  }
  getAudioTracks(): MediaStreamTrack[] {
    throw new Error('Method not implemented.')
  }
  getTrackById(trackId: string): MediaStreamTrack {
    throw new Error('Method not implemented.')
  }
  getVideoTracks(): MediaStreamTrack[] {
    throw new Error('Method not implemented.')
  }
  removeTrack(track: MediaStreamTrack): void {
    throw new Error('Method not implemented.')
  }
  stop(): void {
    throw new Error('Method not implemented.')
  }
  addEventListener<
    K extends 'active' | 'addtrack' | 'inactive' | 'removetrack'
  >(
    type: K,
    listener: (this: MediaStream, ev: MediaStreamEventMap[K]) => void,
    useCapture?: boolean
  ): void
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    useCapture?: boolean
  ): void
  addEventListener(type: any, listener: any, useCapture?: any) {
    throw new Error('Method not implemented.')
  }
  removeEventListener<
    K extends 'active' | 'addtrack' | 'inactive' | 'removetrack'
  >(
    type: K,
    listener: (this: MediaStream, ev: MediaStreamEventMap[K]) => void,
    useCapture?: boolean
  ): void
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    useCapture?: boolean
  ): void
  removeEventListener(type: any, listener: any, useCapture?: any) {
    throw new Error('Method not implemented.')
  }
  dispatchEvent(evt: Event): boolean {
    throw new Error('Method not implemented.')
  }
  getTracks(): MediaStreamTrack[] {
    return [new MediaStreamTrackMock()]
  }
}
