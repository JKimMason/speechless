import {
  Recognition,
  IRecognitionState,
  IRecognition
} from "../src/speech-to-text-recognition";
import {
  SpeechRecognitionStaticMock,
  SpeechRecognitionMock
} from "./__mocks__/webkitSpeechRecognition";
import { oneSentence } from "./__mocks__/reslutsLists";

let recognition: IRecognition;
let speechRecognition: SpeechRecognitionMock;

describe("Recognition", () => {
  beforeEach(() => {
    window.webkitSpeechRecognition = SpeechRecognitionMock;
    recognition = new Recognition();
    recognition.setup();
    speechRecognition = (recognition as any).speechRecognition;
  });
  afterEach(() => {
    delete window.webkitSpeechRecognition;
    Recognition.instance = null;
  });
  it("should be supported", () => {
    expect(Recognition.isSupported()).toBeTruthy();
  });

  it("should not be supported", () => {
    delete window.webkitSpeechRecognition;
    expect(Recognition.isSupported()).toBeFalsy();
  });

  it("should set it lang", () => {
    const langBefore: string = (recognition as any).lang;
    expect(langBefore).toEqual("en");
    recognition.setLang("it");
    const langAfter: string = (recognition as any).lang;
    expect(langAfter).toEqual("it");
  });

  it("should call onChange", () => {
    const spy = jest.spyOn(recognition as any, "onChangeCallback");
    recognition.listen();
    speechRecognition.say(oneSentence("hi are"));
    speechRecognition.say(oneSentence("hi are you"));
    speechRecognition.say(oneSentence("hi are you doing here", true));

    expect(spy).toBeCalledWith("hi are");
    expect(spy).toBeCalledWith("hi are you");
    expect(spy).toBeCalledWith("hi are you doing here");
  });

  it("should call end ", () => {
    const spyEnd = jest.spyOn(recognition as any, "onEndCallback");
    recognition.listen();
    speechRecognition.say(oneSentence("hi are"));
    speechRecognition.say(oneSentence("hi are you"));
    speechRecognition.say(oneSentence("hi are you doing here", true));

    expect(spyEnd).toBeCalledWith("hi are you doing here");
  });

  it("should not call end ", () => {
    const spyEnd = jest.spyOn(recognition as any, "onEndCallback");
    recognition.listen();

    speechRecognition.say(oneSentence("hi are"));
    speechRecognition.say(oneSentence("hi are you"));
    expect(spyEnd).not.toBeCalled();
  });

  it("should not start a runnig recognition ", () => {
    const spy = jest.spyOn(speechRecognition, "start");

    recognition.listen();
    expect(spy).toBeCalled();
    recognition.listen();
    expect(spy.mock.calls.length).toEqual(1);
  });

  it("should not stop a stopped recognition ", () => {
    const spy = jest.spyOn(speechRecognition, "stop");

    recognition.stop();
    expect(spy).not.toBeCalled();
  });

  it("should call stop ", () => {
    const spyEnd = jest.spyOn(recognition as any, "onEndCallback");
    const spyStop = jest.spyOn(recognition as any, "onStopCallback");

    recognition.listen();
    speechRecognition.say(oneSentence("hi are"));
    speechRecognition.say(oneSentence("hi are you"));
    recognition.stop();
    expect(spyEnd).not.toBeCalled();
    expect(spyStop).toBeCalled();
  });

  it("should call the callbacks ", () => {
    const onEndCallback = jest.fn();
    const onChangeCallback = jest.fn();
    const onStopCallback = jest.fn();
    Recognition.instance = null;
    recognition = new Recognition(
      onChangeCallback,
      onEndCallback,
      onStopCallback,
      "he"
    );
    speechRecognition = (recognition as any).speechRecognition;
    expect((recognition as any).lang).toEqual("he");
    recognition.listen();
    speechRecognition.say(oneSentence("hi are"));
    speechRecognition.say(oneSentence("hi are you"));
    speechRecognition.say(oneSentence("hi are you doing here", true));

    expect(onEndCallback).toBeCalledWith("hi are you doing here");

    expect(onChangeCallback).toBeCalledWith("hi are");
    expect(onChangeCallback).toBeCalledWith("hi are you");
    expect(onChangeCallback).toBeCalledWith("hi are you doing here");

    recognition.listen();
    recognition.stop();

    expect(onStopCallback).toBeCalled();
  });
});
