import { EventTarget } from '../../src/EventTarget'

export class Recorder extends EventTarget implements EventTarget {
  constructor(inputPoint: GainNode) {
    super()

    this.stop = this.stop.bind(this)
  }
  record() {
    const ev = new CustomEvent('started')
    this.dispatchEvent(ev)

    setTimeout(this.stop, 1000)
  }
  stop() {
    const ev = new CustomEvent('ended', { detail: 'wow' })

    this.dispatchEvent(ev)
  }
}
