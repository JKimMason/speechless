import { EventTarget } from './EventTarget'

export interface IRecognitionMap {
  data: IRecognitionEvent
  end: IRecognitionEvent
  stop: IRecognitionEvent
  recording: IRecognitionEvent
  sending: IRecognitionEvent
}

export interface IRecognitionEvent extends CustomEvent {
  type: string
  detail: string | undefined
}

export interface IRecognitionEventListener extends EventListener {
  (event?: IRecognitionEvent): any
}

export interface IRecognition<T> {
  setLang(lang: string): IRecognition<T>
  listen(): void
  stop(): void
  addEventListener<K extends keyof IRecognitionMap>(
    type: K,
    listener: IRecognitionEventListener
  ): void
  removeEventListener<K extends keyof IRecognitionMap>(
    type: K,
    listener: IRecognitionEventListener
  ): void
  dispatchEvent(event: IRecognitionEvent): boolean
}

export interface IWindow extends Window {
  webkitSpeechRecognition: SpeechRecognitionStatic
}

export abstract class AbstractRecognition<T> extends EventTarget
  implements IRecognition<T> {
  private state: T

  constructor(private lang: string = 'en') {
    super()
  }

  abstract listen(): void
  abstract stop(): void

  addEventListener<K extends keyof IRecognitionMap>(
    type: K,
    listener: IRecognitionEventListener
  ): void {
    return super.addEventListener(type, listener)
  }

  removeEventListener<K extends keyof IRecognitionMap>(
    type: K,
    listener: IRecognitionEventListener
  ): void {
    return super.removeEventListener(type, listener)
  }

  dispatchEvent(event: IRecognitionEvent): boolean {
    return super.dispatchEvent(event)
  }
  setLang(lang: string): this {
    this.lang = lang
    return this
  }
  getLang(): string {
    return this.lang
  }
  setState(state: T): this {
    this.state = Object.assign({}, this.state, state)
    return this
  }
  getState(): T {
    return this.state
  }
}
