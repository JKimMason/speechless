/// <reference types="webspeechapi" />
import { EventTarget } from './EventTarget';
export interface IRecognitionMap {
    data: IRecognitionEvent;
    end: IRecognitionEvent;
    stop: IRecognitionEvent;
    start: IRecognitionEvent;
    fetching: IRecognitionEvent;
}
export interface IRecognitionEvent extends CustomEvent {
    type: string;
    detail: string | undefined;
}
export interface IRecognitionEventListener extends EventListener {
    (event?: IRecognitionEvent): any;
}
export interface IRecognition<T> {
    setLang(lang: string): IRecognition<T>;
    listen(): void;
    stop(): void;
    addEventListener<K extends keyof IRecognitionMap>(type: K, listener: IRecognitionEventListener): void;
    removeEventListener<K extends keyof IRecognitionMap>(type: K, listener: IRecognitionEventListener): void;
    dispatchEvent(event: IRecognitionEvent): boolean;
}
export interface IWindow extends Window {
    webkitSpeechRecognition: SpeechRecognitionStatic;
}
export declare abstract class AbstractRecognition<T> extends EventTarget implements IRecognition<T> {
    private lang;
    private state;
    constructor(lang?: string);
    abstract listen(): void;
    abstract stop(): void;
    addEventListener<K extends keyof IRecognitionMap>(type: K, listener: IRecognitionEventListener): void;
    removeEventListener<K extends keyof IRecognitionMap>(type: K, listener: IRecognitionEventListener): void;
    dispatchEvent(event: IRecognitionEvent): boolean;
    setLang(lang: string): this;
    getLang(): string;
    setState(state: T): this;
    getState(): T;
}
