import { NativeRecognition } from './NativeRecognition';
import { ExternalRecognition } from './ExternalRecognition';
declare function RecognitionFactory(lang?: string, remoteCall?: (blob?: Blob) => Promise<any>): NativeRecognition | ExternalRecognition;
export { RecognitionFactory };
export { NativeRecognition } from './NativeRecognition';
export { ExternalRecognition } from './ExternalRecognition';
