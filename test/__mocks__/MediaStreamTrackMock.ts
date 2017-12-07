export class MediaStreamTrackMock implements MediaStreamTrack {
  enabled: boolean
  id: string
  kind: string
  label: string
  muted: boolean
  onended: (this: MediaStreamTrack, ev: MediaStreamErrorEvent) => any
  onmute: (this: MediaStreamTrack, ev: Event) => any
  onoverconstrained: (this: MediaStreamTrack, ev: MediaStreamErrorEvent) => any
  onunmute: (this: MediaStreamTrack, ev: Event) => any
  readonly: boolean
  readyState: MediaStreamTrackState
  remote: boolean
  applyConstraints(constraints: MediaTrackConstraints): Promise<void> {
    throw new Error('Method not implemented.')
  }
  clone(): MediaStreamTrack {
    throw new Error('Method not implemented.')
  }
  getCapabilities(): MediaTrackCapabilities {
    throw new Error('Method not implemented.')
  }
  getConstraints(): MediaTrackConstraints {
    throw new Error('Method not implemented.')
  }
  getSettings(): MediaTrackSettings {
    throw new Error('Method not implemented.')
  }
  stop(): void {
    return
  }
  addEventListener<K extends 'ended' | 'mute' | 'overconstrained' | 'unmute'>(
    type: K,
    listener: (this: MediaStreamTrack, ev: MediaStreamTrackEventMap[K]) => void,
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
    K extends 'ended' | 'mute' | 'overconstrained' | 'unmute'
  >(
    type: K,
    listener: (this: MediaStreamTrack, ev: MediaStreamTrackEventMap[K]) => void,
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
}
