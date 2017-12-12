import React, { Component } from "react";

import "./registerServiceWorker";

import Header from "./Components/Header";
import Input from "./Components/Input";
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
              <h3>Auto detect</h3>
              <Input recognition={Speechless("en", getRecognition)} />
            </div>
            <div className="column center">
              <h3>External</h3>
              <Input recognition={new ExternalRecognition("en", getRecognition)} />
            </div>
            <div className="column center" disabled={NativeRecognition.isSupported()}>
              <h3>Native</h3>
              <Input recognition={new NativeRecognition("en")} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
