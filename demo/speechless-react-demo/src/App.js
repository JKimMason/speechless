import "./registerServiceWorker";

import React, { Component } from "react";
import { Speechless, ExternalRecognition, NativeRecognition } from "speechless";

import Header from "./Components/Header";
import RecognitionInput from "./Components/RecognitionInput";
import { getRecognition } from "./api";

import  sources from "./Assets/json/demoSources.json";

import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <div className="Body column center middle">
          <div className="Inputs column end">
            <div className="column center">
              <RecognitionInput
                title={"Auto detect recognition"}
                recognition={Speechless("en", getRecognition)}
                source={sources.auto}
              />
            </div>
            <div className="column center">
              <RecognitionInput
                title={"External recognition"}
                recognition={new ExternalRecognition("en", getRecognition)}
                source={sources.external}
              />
            </div>
            <div className="column center">
              <RecognitionInput
                title={"Native recognition"}
                recognition={new NativeRecognition("en")}
                source={sources.native}
                disabled={!NativeRecognition.isSupported()}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
