import { ExternalRecognition } from '../src'
import { IWindow } from '../src/AbstractRecognition'
import { IExternalRecognitionState } from '../src/ExternalRecognition'
import { MediaStreamMock } from './__mocks__/MediaStream'
import { AudioContextMock } from './__mocks__/AudioContext'
import { setTimeout } from 'timers'

let recognition: ExternalRecognition
let onEndCallback = jest.fn()
let onChangeCallback = jest.fn()
let onStopCallback = jest.fn()

describe('ExternalRecognition', () => {
  describe('ExternalRecognition getUserMedia', () => {
    beforeEach(() => {
      recognition = new ExternalRecognition()
    })
    it('should throw an error no getUserMedia', () => {
      delete (global as any).navigator
      ;(global as any).navigator = {}
      expect(() => recognition.listen()).toThrow()
    })
    it('should use getUserMedia', () => {
      expect(() => recognition.listen()).not.toThrow()
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

  beforeEach(() => {
    ;(window as any).AudioContext = AudioContextMock

    delete (global as any).navigator
    ;(global as any).navigator = {
      getUserMedia: function(_, cb): MediaStream {
        return cb(new MediaStreamMock())
      }
    }
    recognition = new ExternalRecognition()
    recognition.addEventListener('ended', onEndCallback)
    recognition.addEventListener('changed', onChangeCallback)
    recognition.addEventListener('stopped', onStopCallback)
  })

  afterEach(() => {
    onEndCallback.mockReset()
    onChangeCallback.mockReset()
    onStopCallback.mockReset()
  })

  it('should start recording', () => {
    recognition.listen()
    const state: IExternalRecognitionState = (recognition as any).state

    expect(state.recording).toBeTruthy()
  })
  it('should keep recording', () => {
    recognition.listen()
    recognition.listen()
    const state: IExternalRecognitionState = (recognition as any).state

    expect(state.recording).toBeTruthy()
  })
  it('should stop recording after 1 sec', done => {
    recognition.listen()
    const state: IExternalRecognitionState = (recognition as any).state
    setTimeout(() => {
      expect(onStopCallback).not.toBeCalled()
      expect(onEndCallback).toBeCalled()

      expect(state.recording).toBeFalsy()
      done()
    }, 1100)
  })
  it('should stop recording when hit stop', () => {
    recognition.listen()
    recognition.stop()

    const state: IExternalRecognitionState = (recognition as any).state

    expect(state.recording).toBeFalsy()
    expect(onStopCallback).toBeCalled()
  })
  it('should do nothing on stop a stopped recording', () => {
    recognition.stop()
    recognition.stop()
    const state: IExternalRecognitionState = (recognition as any).state

    expect(state.recording).toBeFalsy()
  })
})
