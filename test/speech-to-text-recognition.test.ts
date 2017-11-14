import {
  Recognition,
  IRecognitionState,
  IRecognition
} from '../src/speech-to-text-recognition'
import {
  SpeechRecognitionStaticMock,
  SpeechRecognitionMock
} from './__mocks__/webkitSpeechRecognition'
import { oneSentence } from './__mocks__/reslutsLists'

let recognition: IRecognition
let speechRecognition: SpeechRecognitionMock
let onEndCallback = jest.fn()
let onChangeCallback = jest.fn()
let onStopCallback = jest.fn()
describe('Recognition', () => {
  beforeEach(() => {
    window.webkitSpeechRecognition = SpeechRecognitionMock
    recognition = new Recognition()
    recognition.setup()
    recognition.addEventListener('ended', onEndCallback)
    recognition.addEventListener('changed', onChangeCallback)
    recognition.addEventListener('stopped', onStopCallback)
    speechRecognition = (recognition as any).speechRecognition
  })

  afterEach(() => {
    delete window.webkitSpeechRecognition
    onEndCallback.mockReset()
    onChangeCallback.mockReset()
    onStopCallback.mockReset()
  })

  it('should be supported', () => {
    expect(Recognition.isSupported()).toBeTruthy()
  })

  it('should not be supported', () => {
    delete window.webkitSpeechRecognition
    expect(Recognition.isSupported()).toBeFalsy()
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
    speechRecognition.say(oneSentence('hi are'))
    speechRecognition.say(oneSentence('hi are you'))
    speechRecognition.say(oneSentence('hi are you doing here', true))

    expect(onChangeCallback).toBeCalledWith({
      body: 'hi are',
      type: 'changed'
    })
    expect(onChangeCallback).toBeCalledWith({
      body: 'hi are you',
      type: 'changed'
    })
    expect(onChangeCallback).toBeCalledWith({
      body: 'hi are you doing here',
      type: 'changed'
    })
  })

  it('should call end ', () => {
    recognition.listen()
    speechRecognition.say(oneSentence('hi are'))
    speechRecognition.say(oneSentence('hi are you'))
    speechRecognition.say(oneSentence('hi are you doing here', true))

    expect(onEndCallback).toBeCalledWith({
      body: 'hi are you doing here',
      type: 'ended'
    })
  })

  it('should not call end ', () => {
    recognition.listen()

    speechRecognition.say(oneSentence('hi are'))
    speechRecognition.say(oneSentence('hi are you'))
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
    speechRecognition.say(oneSentence('hi are'))
    speechRecognition.say(oneSentence('hi are you'))
    recognition.stop()
    expect(onEndCallback).not.toBeCalled()
    expect(onStopCallback).toBeCalled()
  })

  it('should call the callbacks ', () => {
    const onEndCallback = jest.fn()
    const onChangeCallback = jest.fn()
    const onStopCallback = jest.fn()
    recognition = new Recognition('he')

    recognition.addEventListener('ended', onEndCallback)
    recognition.addEventListener('changed', onChangeCallback)
    recognition.addEventListener('stopped', onStopCallback)

    speechRecognition = (recognition as any).speechRecognition
    expect((recognition as any).lang).toEqual('he')
    recognition.listen()
    speechRecognition.say(oneSentence('hi are'))
    speechRecognition.say(oneSentence('hi are you'))
    speechRecognition.say(oneSentence('hi are you doing here', true))

    expect(onEndCallback).toBeCalledWith({
      body: 'hi are you doing here',
      type: 'ended'
    })

    expect(onChangeCallback).toBeCalledWith({
      body: 'hi are',
      type: 'changed'
    })
    expect(onChangeCallback).toBeCalledWith({
      body: 'hi are you',
      type: 'changed'
    })
    expect(onChangeCallback).toBeCalledWith({
      body: 'hi are you doing here',
      type: 'changed'
    })

    recognition.listen()
    recognition.stop()

    expect(onStopCallback).toBeCalled()
  })

  it('should remove event listener', () => {
    recognition.removeEventListener('ended', onEndCallback)
    recognition.removeEventListener('changed', onChangeCallback)
    recognition.removeEventListener('stopped', onStopCallback)

    recognition.listen()
    speechRecognition.say(oneSentence('hi are you doing here', true))

    expect(onEndCallback).not.toBeCalled()
    expect(onChangeCallback).not.toBeCalled()

    recognition.listen()
    recognition.stop()

    expect(onStopCallback).not.toBeCalled()
  })

  it('should dispach an event', () => {
    recognition.dispatchEvent({ type: 'stopped' })
    expect(onStopCallback).toBeCalled()
  })

  it('should not throw an error', () => {
    recognition.removeEventListener('test', () => {
      return
    })
    ;(recognition as any).dispatchEvent({ type: 'wow' })
  })
})
