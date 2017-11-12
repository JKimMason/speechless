export const oneSentence = (sentence: string, isFinal: boolean = false) => ({
  length: 1,
  item: (index: number): SpeechRecognitionResult => {
    return;
  },
  0: {
    item: (index: number): SpeechRecognitionAlternative => {
      return;
    },
    length: 1,
    isFinal,
    0: {
      confidence: 0.9,
      transcript: sentence
    }
  }
});