import { EventTarget } from '../../src/EventTarget'

export class Recorder extends EventTarget implements EventTarget {
  constructor(inputPoint: GainNode) {
    super()

    this.stop = this.stop.bind(this)
  }
  record() {
    const ev = new CustomEvent('started')
    this.dispatchEvent(ev)

    setTimeout(() => {
      this.dispatchEvent(new CustomEvent('ended', { detail: 'wow' }))
    }, 1000)
  }
  stop() {
    this.dispatchEvent(new CustomEvent('stopped', { detail: 'wow' }))
  }
}
