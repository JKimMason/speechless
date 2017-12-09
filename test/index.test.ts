import { SpeechRecognitionMock } from 'speech-recognition-mock'
import { RecognitionFactory, ExternalRecognition, NativeRecognition } from '../src'
import { IWindow } from '../src/AbstractRecognition'

describe('ExternalRecognition', () => {
  beforeEach(() => {
    ;(window as IWindow).webkitSpeechRecognition = SpeechRecognitionMock
  })

  it('should throw an error no getUserMedia', () => {
    const recognition = RecognitionFactory()
    expect(recognition instanceof NativeRecognition).toBeTruthy()
  })
  it('should use getUserMedia', () => {
    delete (window as IWindow).webkitSpeechRecognition
    const recognition = RecognitionFactory('en')
    expect(recognition instanceof ExternalRecognition).toBeTruthy()
  })
})
