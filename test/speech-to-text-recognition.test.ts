import { Recognition, IRecognitionState, IRecognition } from "../src/speech-to-text-recognition";
import {
  SpeechRecognitionStaticMock,
  SpeechRecognitionMock
} from "./__mocks__/webkitSpeechRecognition";
import { oneSentence } from "./__mocks__/reslutsLists";

let recognition : IRecognition;

describe("Recognition", () => {
  beforeEach(() => {
    delete window.webkitSpeechRecognition;    
    window.webkitSpeechRecognition = SpeechRecognitionMock;
    recognition = new Recognition();
    recognition.setup();
    
  });
  it("should be supported", () => {
    expect(Recognition.isSupported()).toBeTruthy();
  });

  it("should not be supported", () => {
    delete window.webkitSpeechRecognition;
    expect(Recognition.isSupported()).toBeFalsy();
  });

  it("should set it lang", () => {
    const langBefore :string = (recognition as any).lang;    
    expect(langBefore).toEqual('en');
    recognition.setLang('it')
    const langAfter :string = (recognition as any).lang;
    expect(langAfter).toEqual('it');
  });

  it("should call onChange", () => {
    const spy = jest.spyOn((recognition as any), "onChangeCallback");
    spy.mockReset();
    recognition.speak();
    (recognition as any).speechRecognition.say(oneSentence("hi are"));
    (recognition as any).speechRecognition.say(oneSentence("hi are you"));
    (recognition as any).speechRecognition.say(oneSentence("hi are you doing here", true));

    expect(spy).toBeCalledWith("hi are");
    expect(spy).toBeCalledWith("hi are you");
    expect(spy).toBeCalledWith("hi are you doing here");
  });

  it("should call end ", () => {
    const spyEnd = jest.spyOn((recognition as any), "onEndCallback");
    spyEnd.mockReset()
    recognition.speak();
    (recognition as any).speechRecognition.say(oneSentence("hi are"));
    (recognition as any).speechRecognition.say(oneSentence("hi are you"));
    (recognition as any).speechRecognition.say(oneSentence("hi are you doing here", true));

    expect(spyEnd).toBeCalledWith("hi are you doing here");
  });

  it("should not call end ", () => {
    const spyEnd = jest.spyOn((recognition as any), "onEndCallback");
    spyEnd.mockReset()
    recognition.speak();
    (recognition as any).speechRecognition.say(oneSentence("hi are"));
    (recognition as any).speechRecognition.say(oneSentence("hi are you"));
    expect(spyEnd).not.toBeCalled();
  });

  it("should call stop ", () => {
    const spyEnd = jest.spyOn((recognition as any), "onEndCallback");
    spyEnd.mockReset()
    
    const spyStop = jest.spyOn((recognition as any), "onStopCallback");
    spyStop.mockReset()
    
    recognition.speak();
    (recognition as any).speechRecognition.say(oneSentence("hi are"));
    (recognition as any).speechRecognition.say(oneSentence("hi are you"));
    recognition.stop();
    // expect(spyEnd).not.toBeCalled();
    expect(spyStop).toBeCalled();
  });
});
