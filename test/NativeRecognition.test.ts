import { SpeechRecognitionMock } from 'speech-recognition-mock'

import { NativeRecognition } from '../src'
import { IWindow, IRecognitionEvent } from '../src/AbstractRecognition'

let recognition: NativeRecognition
let speechRecognition: SpeechRecognitionMock
let onEndCallback = jest.fn()
let onChangeCallback = jest.fn()
let onStopCallback = jest.fn()

describe('NativeRecognition', () => {
  beforeEach(() => {
    ;(window as IWindow).webkitSpeechRecognition = SpeechRecognitionMock
    recognition = new NativeRecognition()
    recognition.setup()
    recognition.addEventListener('ended', onEndCallback)
    recognition.addEventListener('changed', onChangeCallback)
    recognition.addEventListener('stopped', onStopCallback)
    speechRecognition = (recognition as any).speechRecognition
  })

  afterEach(() => {
    delete (window as IWindow).webkitSpeechRecognition
    onEndCallback.mockReset()
    onChangeCallback.mockReset()
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
    const changedCalls: IRecognitionEvent[][] = onChangeCallback.mock.calls
    expect(changedCalls[0][0].type).toEqual('changed')
    expect(changedCalls[0][0].detail).toEqual('hi are')

    expect(changedCalls[1][0].type).toEqual('changed')
    expect(changedCalls[1][0].detail).toEqual('hi are you')

    expect(changedCalls[2][0].type).toEqual('changed')
    expect(changedCalls[2][0].detail).toEqual('hi are you doing here')
  })

  it('should call end ', () => {
    recognition.listen()
    speechRecognition.say('hi are', false)
    speechRecognition.say('hi are you', false)
    speechRecognition.say('hi are you doing here', true)

    const endCalls: IRecognitionEvent[][] = onEndCallback.mock.calls

    expect(endCalls[0][0].type).toEqual('ended')
    expect(endCalls[0][0].detail).toEqual('hi are you doing here')
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

  it('should not stop a stopped recognition ', () => {
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

    recognition.addEventListener('ended', onEndCallback)
    recognition.addEventListener('changed', onChangeCallback)
    recognition.addEventListener('stopped', onStopCallback)

    speechRecognition = (recognition as any).speechRecognition
    expect((recognition as any).lang).toEqual('he')
    recognition.listen()
    speechRecognition.say('hi are', false)
    speechRecognition.say('hi are you', false)
    speechRecognition.say('hi are you doing here', true)
    const endCalls: IRecognitionEvent[][] = onEndCallback.mock.calls
    const changedCalls: IRecognitionEvent[][] = onChangeCallback.mock.calls

    expect(endCalls[0][0].type).toEqual('ended')
    expect(endCalls[0][0].detail).toEqual('hi are you doing here')

    expect(changedCalls[0][0].type).toEqual('changed')
    expect(changedCalls[0][0].detail).toEqual('hi are')

    expect(changedCalls[1][0].type).toEqual('changed')
    expect(changedCalls[1][0].detail).toEqual('hi are you')

    expect(changedCalls[2][0].type).toEqual('changed')
    expect(changedCalls[2][0].detail).toEqual('hi are you doing here')

    recognition.listen()
    recognition.stop()

    expect(onStopCallback).toBeCalled()
  })

  it('should remove event listener', () => {
    recognition.removeEventListener('ended', onEndCallback)
    recognition.removeEventListener('changed', onChangeCallback)
    recognition.removeEventListener('stopped', onStopCallback)

    recognition.listen()
    speechRecognition.say('hi are you doing here', true)
    expect(onEndCallback).not.toBeCalled()
    expect(onChangeCallback).not.toBeCalled()

    recognition.listen()
    recognition.stop()

    expect(onStopCallback).not.toBeCalled()
  })

  it('should dispach an event', () => {
    const evStopped = new CustomEvent('stopped')

    recognition.dispatchEvent(evStopped)
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
