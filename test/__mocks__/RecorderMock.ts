import { EventTarget } from '../../src/EventTarget'

export class Recorder extends EventTarget implements EventTarget {
  constructor(stream: MediaStream) {
    super()

    this.stop = this.stop.bind(this)
  }
  start() {
    this.dispatchEvent(new CustomEvent('start'))
    this.dispatchEvent(new CustomEvent('data', { detail: new Blob() }))
  }
  reset() {
    this.dispatchEvent(new CustomEvent('reset'))
  }
  stop() {
    this.dispatchEvent(new CustomEvent('end'))
  }
  abort() {
    this.dispatchEvent(new CustomEvent('stop'))
  }
}
