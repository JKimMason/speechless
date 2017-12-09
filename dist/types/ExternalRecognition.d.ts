import { Recorder } from 'web-recorder';
import { AbstractRecognition } from './AbstractRecognition';
export interface IExternalRecognition extends AbstractRecognition<IExternalRecognitionState> {
    recorder: Recorder;
    getRecorder(): Recorder;
}
export interface IExternalRecognitionState {
    value?: any;
    listening?: boolean;
    fetching?: boolean;
}
export declare class ExternalRecognition extends AbstractRecognition<IExternalRecognitionState> {
    private remoteCall;
    recorder: Recorder;
    private speechRecognition;
    private audioContext;
    private stream;
    constructor(lang?: string, remoteCall?: ((blob?: Blob | undefined) => Promise<any>) | undefined);
    listen(): ExternalRecognition;
    kill(): void;
    stop(): ExternalRecognition;
    getRecorder(): Recorder;
    private record();
    private onGotStream(stream);
    private onRecordingStart();
    private onRecordingEnd();
    private onRecordingStop(ev);
    private onRecordingData(ev);
    private onRemoteResult(res);
}
