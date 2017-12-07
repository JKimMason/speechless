import { ExternalRecognition } from '../src'
import { IWindow } from '../src/AbstractRecognition'
import { IExternalRecognitionState } from '../src/ExternalRecognition'
import { MediaStreamMock } from './__mocks__/MediaStreamMock'
import { AudioContextMock } from './__mocks__/AudioContextMock'
import { setTimeout } from 'timers'
import { Recorder } from 'web-recorder/dist/types/recorder'

let recognition: ExternalRecognition
let recorder: Recorder
let onEndCallback = jest.fn()
let onChangeCallback = jest.fn()
let onStopCallback = jest.fn()
let onStartCallback = jest.fn()

describe('ExternalRecognition', () => {
  beforeEach(() => {
    ;(window as any).AudioContext = AudioContextMock

    delete (global as any).navigator
    ;(global as any).navigator = {
      getUserMedia: function(_, cb): MediaStream {
        return cb(new MediaStreamMock())
      }
    }
    recognition = new ExternalRecognition('en')
    recognition.addEventListener('end', onEndCallback)
    recognition.addEventListener('data', onChangeCallback)
    recognition.addEventListener('stop', onStopCallback)
    recognition.addEventListener('start', onStartCallback)
    recorder = (recognition as any).recorder
  })

  afterEach(() => {
    onEndCallback.mockReset()
    onChangeCallback.mockReset()
    onStopCallback.mockReset()
  })
  it('should set lang', () => {
    recognition = new ExternalRecognition('he')

    expect(recognition.getLang()).toEqual('he')

    recognition = new ExternalRecognition(undefined)

    expect(recognition.getLang()).toEqual('en')
  })
  it('should start recording', () => {
    recognition.listen()
    const state: IExternalRecognitionState = recognition.getState()

    expect(state.recording).toBeTruthy()
  })
  it('should keep recording', () => {
    recognition.listen()
    recognition.listen()
    const state: IExternalRecognitionState = recognition.getState()

    expect(state.recording).toBeTruthy()
  })
  it('should stop recording', () => {
    recognition.listen()
    const recorder = recognition.getRecorder()
    recorder.abort()
    const state: IExternalRecognitionState = recognition.getState()
    expect(onEndCallback).toBeCalled()
    expect(state.recording).toBeFalsy()
  })
  it('should force stop recording', () => {
    recognition.listen()
    recognition.stop()
    const state: IExternalRecognitionState = recognition.getState()

    expect(onStopCallback).toBeCalled()
    expect(state.recording).toBeFalsy()
  })
  it('should do nothing if trying to stop a stopped recording', () => {
    const prevState: IExternalRecognitionState = recognition.getState()
    recognition.stop()
    const nextState: IExternalRecognitionState = recognition.getState()
    expect(prevState).toEqual(nextState)
    expect(onEndCallback).not.toBeCalled()
    expect(onStopCallback).not.toBeCalled()
    expect(onStartCallback).not.toBeCalled()
  })
})
