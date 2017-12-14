import { ExternalRecognition } from '../src/speechless'
import { IWindow } from '../src/AbstractRecognition'
import { IExternalRecognitionState } from '../src/ExternalRecognition'
import { setTimeout } from 'timers'
import { Recorder } from 'web-recorder/dist/types/recorder'
import { AudioContext } from 'standardized-audio-context-mock'

let recognition: ExternalRecognition
let onEndCallback = jest.fn()
let onDataCallback = jest.fn()
let onStopCallback = jest.fn()
let onStartCallback = jest.fn()
let onFetchingCallback = jest.fn()
let onResultCallback = function onResult(blob: Blob) {
  return Promise.resolve('external')
}

function setup(lang: string, cb?) {
  ;(window as any).AudioContext = AudioContext

  delete (global as any).navigator
  ;(global as any).navigator = {
    getUserMedia: function(_, cb): any {
      return cb({})
    }
  }
  recognition = new ExternalRecognition(lang, cb)
  recognition.addEventListener('end', onEndCallback)
  recognition.addEventListener('data', onDataCallback)
  recognition.addEventListener('fetching', onFetchingCallback)
  recognition.addEventListener('stop', onStopCallback)
  recognition.addEventListener('start', onStartCallback)
}

describe('ExternalRecognition', () => {
  beforeEach(() => {
    setup('en', onResultCallback)
  })

  afterEach(() => {
    onEndCallback.mockReset()
    onDataCallback.mockReset()
    onFetchingCallback.mockReset()
    onStopCallback.mockReset()
    onStartCallback.mockReset()
  })

  it('should set lang', () => {
    recognition = new ExternalRecognition('he', jest.fn())

    expect(recognition.getLang()).toEqual('he')
  })
  it('should start listening', () => {
    recognition.listen()
    const state: IExternalRecognitionState = recognition.getState()

    expect(state.listening).toBeTruthy()
  })
  it('should keep listening', () => {
    recognition.listen()
    recognition.listen()
    const state: IExternalRecognitionState = recognition.getState()

    expect(state.listening).toBeTruthy()
  })
  it('should stop listening', done => {
    recognition.listen()
    const recorder = recognition.getRecorder()
    recorder.stop()
    setImmediate(() => {
      const state: IExternalRecognitionState = recognition.getState()
      expect(onFetchingCallback).toBeCalled()
      expect(onDataCallback).toBeCalled()
      expect(onEndCallback).toBeCalled()
      expect(state.listening).toBeFalsy()
      done()
    })
  })
  it('should force stop listening', done => {
    recognition.listen()
    recognition.stop()
    const state: IExternalRecognitionState = recognition.getState()
    setImmediate(() => {
      expect(onEndCallback).toBeCalled()
      expect(state.listening).toBeFalsy()
      done()
    })
  })
  it('should kill listening', done => {
    recognition.listen()
    recognition.kill()
    const state: IExternalRecognitionState = recognition.getState()
    setImmediate(() => {
      expect(onStopCallback).toBeCalled()
      expect(state.listening).toBeFalsy()
      done()
    })
  })
  it('should do nothing if trying to stop a stopped listening', () => {
    const prevState: IExternalRecognitionState = recognition.getState()
    recognition.stop()
    const nextState: IExternalRecognitionState = recognition.getState()
    expect(prevState).toEqual(nextState)
    expect(onEndCallback).not.toBeCalled()
    expect(onStopCallback).not.toBeCalled()
    expect(onStartCallback).not.toBeCalled()
  })
  it("should not dispatch fetching if didn't set remoteCall", done => {
    recognition = new ExternalRecognition('en')

    recognition.addEventListener('fetching', onFetchingCallback)
    recognition.listen()
    const recorder = recognition.getRecorder()
    recorder.stop()
    setImmediate(() => {
      const state: IExternalRecognitionState = recognition.getState()
      expect(onFetchingCallback).not.toBeCalled()
      expect(state.listening).toBeFalsy()
      done()
    })
  })
})
