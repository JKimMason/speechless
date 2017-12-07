import {
  IAudioNode,
  IBaseAudioContext,
  TChannelCountMode,
  TChannelInterpretation
} from 'standardized-audio-context'

export class AudioNodeMock implements IAudioNode {
  readonly context: IBaseAudioContext
  channelCount: number
  channelCountMode: TChannelCountMode
  channelInterpretation: TChannelInterpretation
  connect: any
  disconnect: any
  numberOfInputs: number
  numberOfOutputs: number
  private _context
  constructor(options: {
    channelCount: number
    channelCountMode: TChannelCountMode
    channelInterpretation: TChannelInterpretation
    context: AudioContext
    connect?: any
    disconnect?: any
    numberOfInputs: number
    numberOfOutputs: number
  }) {
    return
  }
  addEventListener(
    type: string,
    listener?: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void {
    throw new Error('Method not implemented.')
  }
  dispatchEvent(evt: Event): boolean {
    throw new Error('Method not implemented.')
  }
  removeEventListener(
    type: string,
    listener?: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void {
    throw new Error('Method not implemented.')
  }
}
