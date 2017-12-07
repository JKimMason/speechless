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

describe('ExternalRecognition getUserMedia', () => {
  beforeEach(() => {
    recognition = new ExternalRecognition()
  })
  it('should throw an error no getUserMedia', () => {
    delete (global as any).navigator
    ;(global as any).navigator = {}
    expect(() => recognition.listen()).toThrow()
  })
  it('should use webkitGetUserMedia', () => {
    delete (global as any).navigator
    ;(global as any).navigator = {
      webkitGetUserMedia: jest.fn()
    }
    expect(() => recognition.listen()).not.toThrow()
  })
  it('should use mozGetUserMedia', () => {
    delete (global as any).navigator
    ;(global as any).navigator = {
      mozGetUserMedia: jest.fn()
    }
    expect(() => recognition.listen()).not.toThrow()
  })
  it('should use mozGetUserMedia', () => {
    delete (global as any).navigator
    ;(global as any).navigator = {
      mediaDevices: {
        getUserMedia: jest.fn()
      }
    }
    expect(() => recognition.listen()).not.toThrow()
  })
})

describe.only('ExternalRecognition', () => {
  beforeEach(() => {
    ;(window as any).AudioContext = AudioContextMock

    delete (global as any).navigator
    ;(global as any).navigator = {
      getUserMedia: function(_, cb): MediaStream {
        return cb(new MediaStreamMock())
      }
    }
    recognition = new ExternalRecognition()
    recognition.addEventListener('end', onEndCallback)
    recognition.addEventListener('data', onChangeCallback)
    recognition.addEventListener('stop', onStopCallback)
    recorder = (recognition as any).recorder
  })

  afterEach(() => {
    onEndCallback.mockReset()
    onChangeCallback.mockReset()
    onStopCallback.mockReset()
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
  it('should do nothing on stop a stop recording', done => {
    recognition.listen()
    setTimeout(() => {
      recognition.stop()
      const state: IExternalRecognitionState = recognition.getState()

      expect(onStopCallback).toBeCalled()
      expect(state.recording).toBeFalsy()
      done()
    }, 1000)
  })
})
