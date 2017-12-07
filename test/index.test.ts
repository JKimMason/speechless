import { SpeechRecognitionMock } from 'speech-recognition-mock'
import { Recognition } from '../src'
import { IWindow, AbstractRecognition } from '../src/AbstractRecognition'
import { ExternalRecognition } from '../src/ExternalRecognition'
import { NativeRecognition } from '../src/NativeRecognition'

describe('ExternalRecognition', () => {
  beforeEach(() => {
    ;(window as IWindow).webkitSpeechRecognition = SpeechRecognitionMock
  })

  it('should throw an error no getUserMedia', () => {
    const recognition = Recognition()
    expect(recognition instanceof NativeRecognition).toBeTruthy()
  })
  it('should use getUserMedia', () => {
    delete (window as IWindow).webkitSpeechRecognition
    const recognition = Recognition('en')
    expect(recognition instanceof ExternalRecognition).toBeTruthy()
  })
})
