import { SpeechRecognitionMock } from 'speech-recognition-mock'
import { AudioContext } from 'standardized-audio-context-mock'
import { ExternalRecognition } from '../src'
import { IWindow } from '../src/AbstractRecognition'
import { IExternalRecognitionState } from '../src/ExternalRecognition'

let recognition: ExternalRecognition
let speechRecognition: SpeechRecognitionMock
let onEndCallback = jest.fn()
let onChangeCallback = jest.fn()
let onStopCallback = jest.fn()

describe('ExternalRecognition', () => {
  describe('ExternalRecognition getUserMedia', () => {
    beforeEach(() => {
      delete (global as any).navigator
      ;(global as any).navigator = {
        getUserMedia: jest.fn()
      }
      recognition = new ExternalRecognition()

      speechRecognition = (recognition as any).speechRecognition
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
    ;(window as any).AudioContext = AudioContext

    delete (global as any).navigator
    ;(global as any).navigator = {
      getUserMedia: jest.fn()
    }
    recognition = new ExternalRecognition()
    recognition.addEventListener('ended', onEndCallback)
    recognition.addEventListener('changed', onChangeCallback)
    recognition.addEventListener('stopped', onStopCallback)
    speechRecognition = (recognition as any).speechRecognition
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
})
