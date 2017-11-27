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

export abstract class AbstractRecognition implements IRecognition {
  private listeners: {
    [key: string]: IRecognitionEventListener[]
  }
  private eventTarget: DocumentFragment

  constructor(private lang: string = 'en') {
    this.eventTarget = document.createDocumentFragment()
  }

  abstract listen(): void
  abstract stop(): void

  addEventListener<K extends keyof IRecognitionMap>(
    type: K,
    listener: IRecognitionEventListener
  ): void {
    return this.eventTarget.addEventListener(type, listener)
  }

  removeEventListener<K extends keyof IRecognitionMap>(
    type: K,
    listener: IRecognitionEventListener
  ): void {
    return this.eventTarget.removeEventListener(type, listener)
  }

  dispatchEvent(event: IRecognitionEvent): boolean {
    return this.eventTarget.dispatchEvent(event)
  }
  setLang(lang: string): this {
    this.lang = lang
    return this
  }
  getLang(): string {
    return this.lang
  }
}
