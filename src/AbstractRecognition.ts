import { EventTarget } from './EventTarget'

export interface IRecognitionMap {
  changed: IRecognitionEvent
  ended: IRecognitionEvent
  stopped: IRecognitionEvent
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

export interface IRecognition {
  setLang(lang: string): IRecognition
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

export abstract class AbstractRecognition extends EventTarget
  implements IRecognition {
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
}
