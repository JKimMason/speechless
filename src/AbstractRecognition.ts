export interface IRecognitionMap {
  changed: IRecognitionEvent
  ended: IRecognitionEvent
  stopped: IRecognitionEvent
  recording: IRecognitionEvent
  sending: IRecognitionEvent
}

export interface IRecognitionEvent {
  type: string
  body?: string
}

export interface IRecognitionEventListener {
  (event?: IRecognitionEvent): any
}

export interface IRecognition {
  setup(): IRecognition
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

  constructor(private lang: string = 'en') {
    this.listeners = {}
  }

  abstract setup(): this
  abstract listen(): void
  abstract stop(): void

  addEventListener<K extends keyof IRecognitionMap>(
    type: K,
    listener: IRecognitionEventListener
  ): void {
    this.listeners[type] = this.listeners[type] || []
    this.listeners[type].push(listener)
  }

  removeEventListener<K extends keyof IRecognitionMap>(
    type: K,
    listener: IRecognitionEventListener
  ): void {
    if (!(type in this.listeners)) {
      return
    }
    this.listeners[type] = this.listeners[type].filter(
      callback => callback !== listener
    )
  }

  dispatchEvent(event: IRecognitionEvent): boolean {
    if (!(event.type in this.listeners)) {
      return true
    }
    this.listeners[event.type].forEach(callback => {
      callback.call(this, event)
    })
    return true
  }
  setLang(lang: string): this {
    this.lang = lang
    return this
  }
  getLang(): string {
    return this.lang
  }
}
