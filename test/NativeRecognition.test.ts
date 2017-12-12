import { SpeechRecognitionMock } from 'speech-recognition-mock'

import { NativeRecognition } from '../src/speechless'
import { IWindow, IRecognitionEvent } from '../src/AbstractRecognition'

let recognition: NativeRecognition
let speechRecognition: SpeechRecognitionMock
let onEndCallback = jest.fn()
let onDataCallback = jest.fn()
let onStopCallback = jest.fn()

describe('NativeRecognition', () => {
  beforeEach(() => {
    ;(window as IWindow).webkitSpeechRecognition = SpeechRecognitionMock
    recognition = new NativeRecognition('en')
    recognition.setup()
    recognition.addEventListener('end', onEndCallback)
    recognition.addEventListener('data', onDataCallback)
    recognition.addEventListener('stop', onStopCallback)
    speechRecognition = (recognition as any).speechRecognition
  })

  afterEach(() => {
    delete (window as IWindow).webkitSpeechRecognition
    onEndCallback.mockReset()
    onDataCallback.mockReset()
    onStopCallback.mockReset()
  })

  it('should be supported', () => {
    expect(NativeRecognition.isSupported()).toBeTruthy()
  })

  it('should not be supported', () => {
    delete (window as IWindow).webkitSpeechRecognition
    expect(NativeRecognition.isSupported()).toBeFalsy()
  })

  it('should set it lang', () => {
    const langBefore: string = (recognition as any).lang
    expect(langBefore).toEqual('en')
    recognition.setLang('it')
    const langAfter: string = (recognition as any).lang
    expect(langAfter).toEqual('it')
  })

  it('should call onChange', () => {
    recognition.listen()
    speechRecognition.say('hi are', false)
    speechRecognition.say('hi are you', false)
    speechRecognition.say('hi are you doing here', true)
    const dataCalls: IRecognitionEvent[][] = onDataCallback.mock.calls
    expect(dataCalls[0][0].type).toEqual('data')
    expect(dataCalls[0][0].detail).toEqual('hi are')

    expect(dataCalls[1][0].type).toEqual('data')
    expect(dataCalls[1][0].detail).toEqual('hi are you')

    expect(dataCalls[2][0].type).toEqual('data')
    expect(dataCalls[2][0].detail).toEqual('hi are you doing here')
  })

  it('should call end ', () => {
    recognition.listen()
    speechRecognition.say('hi are', false)
    speechRecognition.say('hi are you', false)
    speechRecognition.say('hi are you doing here', true)

    const endCalls: IRecognitionEvent[][] = onEndCallback.mock.calls

    expect(endCalls[0][0].type).toEqual('end')
  })

  it('should not call end ', () => {
    recognition.listen()

    speechRecognition.say('hi are', false)
    speechRecognition.say('hi are you', false)
    expect(onEndCallback).not.toBeCalled()
  })

  it('should not start a runnig recognition ', () => {
    const spy = jest.spyOn(speechRecognition, 'start')

    recognition.listen()
    expect(spy).toBeCalled()
    recognition.listen()
    expect(spy.mock.calls.length).toEqual(1)
  })

  it('should not stop a stop recognition ', () => {
    const spy = jest.spyOn(speechRecognition, 'stop')

    recognition.stop()
    expect(spy).not.toBeCalled()
  })

  it('should call stop ', () => {
    recognition.listen()
    speechRecognition.say('hi are', false)
    speechRecognition.say('hi are you', false)
    recognition.stop()
    expect(onEndCallback).not.toBeCalled()
    expect(onStopCallback).toBeCalled()
  })

  it('should call the callbacks ', () => {
    const onEndCallback = jest.fn()
    const onChangeCallback = jest.fn()
    const onStopCallback = jest.fn()
    recognition = new NativeRecognition('he')

    recognition.addEventListener('end', onEndCallback)
    recognition.addEventListener('data', onChangeCallback)
    recognition.addEventListener('stop', onStopCallback)

    speechRecognition = (recognition as any).speechRecognition
    expect((recognition as any).lang).toEqual('he')
    recognition.listen()
    speechRecognition.say('hi are', false)
    speechRecognition.say('hi are you', false)
    speechRecognition.say('hi are you doing here', true)
    const endCalls: IRecognitionEvent[][] = onEndCallback.mock.calls
    const dataCalls: IRecognitionEvent[][] = onChangeCallback.mock.calls

    expect(endCalls[0][0].type).toEqual('end')

    expect(dataCalls[0][0].type).toEqual('data')
    expect(dataCalls[0][0].detail).toEqual('hi are')

    expect(dataCalls[1][0].type).toEqual('data')
    expect(dataCalls[1][0].detail).toEqual('hi are you')

    expect(dataCalls[2][0].type).toEqual('data')
    expect(dataCalls[2][0].detail).toEqual('hi are you doing here')

    recognition.listen()
    recognition.stop()

    expect(onStopCallback).toBeCalled()
  })

  it('should remove event listener', () => {
    recognition.removeEventListener('end', onEndCallback)
    recognition.removeEventListener('data', onDataCallback)
    recognition.removeEventListener('stop', onStopCallback)

    recognition.listen()
    speechRecognition.say('hi are you doing here', true)
    expect(onEndCallback).not.toBeCalled()
    expect(onDataCallback).not.toBeCalled()

    recognition.listen()
    recognition.stop()

    expect(onStopCallback).not.toBeCalled()
  })

  it('should dispach an event', () => {
    const evstop = new CustomEvent('stop')

    recognition.dispatchEvent(evstop)
    expect(onStopCallback).toBeCalled()
  })

  it('should not throw an error', () => {
    ;(recognition as any).removeEventListener('test', () => {
      return
    })
    const ev = new CustomEvent('test2')
    ;(recognition as any).dispatchEvent(ev)
  })
})
