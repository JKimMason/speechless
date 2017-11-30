import { EventTarget } from '../../src/EventTarget'

export class Recorder extends EventTarget implements EventTarget {
  constructor(stream: MediaStream) {
    super()

    this.stop = this.stop.bind(this)
  }
  start() {
    this.dispatchEvent(new CustomEvent('start'))

    setTimeout(() => {
      this.dispatchEvent(new CustomEvent('data', { detail: 'wow' }))
      this.dispatchEvent(new CustomEvent('stop'))
    }, 1000)
  }
  reset() {
    this.dispatchEvent(new CustomEvent('reset'))
  }
  stop() {
    this.dispatchEvent(new CustomEvent('stop'))
  }
}
