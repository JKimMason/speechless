import { NativeRecognition } from './NativeRecognition';
import { ExternalRecognition } from './ExternalRecognition';
declare function Speechless(lang?: string, remoteCall?: (blob?: Blob) => Promise<any>): NativeRecognition | ExternalRecognition;
export { Speechless };
export { NativeRecognition } from './NativeRecognition';
export { ExternalRecognition } from './ExternalRecognition';
