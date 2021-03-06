/// <reference types="webspeechapi" />
import { AbstractRecognition } from './AbstractRecognition';
export interface INativeRecognitionState {
    value?: string;
    listening?: boolean;
    force?: boolean;
}
export declare class NativeRecognition extends AbstractRecognition<INativeRecognitionState> {
    private speechRecognition;
    constructor(lang?: string);
    static getSpeechRecognition(): SpeechRecognitionStatic;
    static isSupported(): boolean;
    listen(): NativeRecognition;
    stop(): NativeRecognition;
    private setup();
    private onChange(interimTranscript);
    private onFinal(finalTranscript);
    private onSpeechRecognitionStart();
    private onSpeechRecognitionEnd();
    private onSpeechRecognitionResult(event);
}
