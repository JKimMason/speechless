import React, { Component } from 'react'

import Header from './Components/Header'
import Input from './Components/Input'
import './App.css'
import { RecognitionFactory, ExternalRecognition, NativeRecognition } from 'speechless'
import { getRecognition } from './api'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <div className="Body column center">
          <div className="column end">
            <div className="row center">
              <h3>Auto detect</h3>
              <Input recognition={RecognitionFactory('en', getRecognition)} />
            </div>
            <div className="row center">
              <h3>External</h3>
              <Input recognition={new ExternalRecognition('en', getRecognition)} />
            </div>
            <div className="row center">
              <h3>Native</h3>
              <Input recognition={new NativeRecognition('en')} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default App
