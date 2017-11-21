import { NativeRecognition } from './NativeRecognition'
import { ExternalRecognition } from './ExternalRecognition'
import { IRecognition } from './AbstractRecognition'

export function Recognition(lang: string): IRecognition {
  if (NativeRecognition.isSupported) {
    return new NativeRecognition(lang)
  }
  return new ExternalRecognition(lang)
}
