import React, { Component } from 'react'

import Header from './Components/Header'
import Input from './Components/Input'
import './App.css'

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <div className="Body column center">
        <div className="row center">
          <Input />
          </div>
        </div>
      </div>
    )
  }
}

export default App
