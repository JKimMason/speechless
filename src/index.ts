import { NativeRecognition } from './NativeRecognition'
import { ExternalRecognition } from './ExternalRecognition'
import { AbstractRecognition } from './AbstractRecognition'

export function Recognition(lang?: string): AbstractRecognition {
  if (NativeRecognition.isSupported()) {
    return new NativeRecognition(lang)
  }
  return new ExternalRecognition(lang)
}

export { NativeRecognition } from './NativeRecognition'
export { ExternalRecognition } from './ExternalRecognition'
