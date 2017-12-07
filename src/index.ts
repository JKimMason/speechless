import { NativeRecognition } from './NativeRecognition'
import { ExternalRecognition } from './ExternalRecognition'
import { AbstractRecognition } from './AbstractRecognition'

export function Recognition(
  lang?: string,
  remoteCall?: (blob?: Blob) => Promise<any>
): NativeRecognition | ExternalRecognition {
  if (NativeRecognition.isSupported()) {
    return new NativeRecognition(lang)
  }
  return new ExternalRecognition(lang, remoteCall)
}

export { NativeRecognition } from './NativeRecognition'
export { ExternalRecognition } from './ExternalRecognition'
