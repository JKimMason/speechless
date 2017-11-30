import { AudioNodeMock } from './AudioNode'

export class MediaStreamAudioSourceNodeMock {
  channelCount: number
  channelCountMode: ChannelCountMode
  channelInterpretation: ChannelInterpretation
  context: AudioContext
  numberOfInputs: number
  numberOfOutputs: number
  //   connect(destination: AudioNode, output?: number, input?: number): AudioNode
  connect(destination: AudioParam, output?: number): void
  connect(destination: any, output?: any, input?: any) {
    return new AudioNodeMock({
      channelCount: this.channelCount,
      channelCountMode: this.channelCountMode,
      channelInterpretation: this.channelInterpretation,
      context: this.context,
      numberOfInputs: this.numberOfInputs,
      numberOfOutputs: this.numberOfOutputs
    })
  }
  disconnect(output?: number): void
  disconnect(destination: AudioNode, output?: number, input?: number): void
  disconnect(destination: AudioParam, output?: number): void
  disconnect(destination?: any, output?: any, input?: any) {
    throw new Error('Method not implemented.')
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
