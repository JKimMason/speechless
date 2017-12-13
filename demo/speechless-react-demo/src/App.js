import React, { Component } from "react";

import "./registerServiceWorker";

import Header from "./Components/Header";
import RecognitionInput from "./Components/RecognitionInput";
import "./App.css";
import { Speechless, ExternalRecognition, NativeRecognition } from "speechless";
import { getRecognition } from "./api";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <div className="Body column center middle">
          <div className="Inputs column end">
            <div className="column center">
              <RecognitionInput title={"Auto detect recognition"} recognition={Speechless("en", getRecognition)} />
            </div>
            <div className="column center">
              <RecognitionInput title={"External recognition"} recognition={new ExternalRecognition("en", getRecognition)} />
            </div>
            <div className="column center" disabled={NativeRecognition.isSupported()}>
              <RecognitionInput title={"Native recognition"} recognition={new NativeRecognition("en")} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
