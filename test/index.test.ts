import { SpeechRecognitionMock } from 'speech-recognition-mock'
import { Speechless, ExternalRecognition, NativeRecognition } from '../src/speechless'
import { IWindow } from '../src/AbstractRecognition'

describe('ExternalRecognition', () => {
  beforeEach(() => {
    ;(window as IWindow).webkitSpeechRecognition = SpeechRecognitionMock
  })

  it('should throw an error no getUserMedia', () => {
    const recognition = Speechless()
    expect(recognition instanceof NativeRecognition).toBeTruthy()
  })
  it('should use getUserMedia', () => {
    delete (window as IWindow).webkitSpeechRecognition
    const recognition = Speechless('en')
    expect(recognition instanceof ExternalRecognition).toBeTruthy()
  })
})
