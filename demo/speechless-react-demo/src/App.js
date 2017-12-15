import React, { Component } from "react";

import "./registerServiceWorker";

import Header from "./Components/Header";
import RecognitionInput from "./Components/RecognitionInput";
import "./App.css";
import { Speechless, ExternalRecognition, NativeRecognition } from "speechless";
import { getRecognition } from "./api";

const sources = {
  auto: `
\`\`\`
import { Speechless } from "speechless";

const getRecognition = blob =>
  toBase64(blob)
    .then(base64data => base64data.substr(base64data.indexOf(',') + 1))
    .then(remoteCall)
    .then(res => res.json())
    .then(res => {
      if (!res || isEmpty(res)) {
        return ''
      }
      return res.results[0].alternatives[0].transcript
    })

class RecognitionInput extends React.PureComponent {
  state = {
    data: "",
    fetching: false,
    listening: false,
  };
  constructor(props){
    super(props)
    const recognition = Speechless("en", getRecognition)
    recognition.addEventListener("start", this.onStart); 
    recognition.addEventListener("fetching", this.onFetching);
    recognition.addEventListener("data", this.onData);
    recognition.addEventListener("end", this.onEnd);
  }
  onListen = () => {
    const { recognition } = this.props
    recognition.listen();
  };
  onFetching = e => {
    this.setState({ fetching: true, listening: false });
  };
  onStart = e => {
    this.setState({ listening: true });
  };
  onEnd = e => {
    this.setState({ fetching: false, listening: false });
  };
  onData = e => {
    this.setState({ data: e.detail });
  };
  renderButton() {
    const { fetching, listening } = this.state;
    if (fetching) {
      return <img src={loader} alt="fetching" />;
    }
    if (listening) {
      return <img src={recording} alt="recording" />;
    }
    return <img src={mic} alt="mic" />;
  }
  render() {
    const { data, fetching } = this.state;
    return (
      <div className="Input row">
          <input 
            disabled 
            placeholder="press the mic..." 
            name="msg" type="text" 
            value={data} />
          <button 
            disabled={fetching} 
            type="button" 
            onClick={this.onListen}>
            {this.renderButton()}
          </button>
      </div>
    );
  }
}
\`\`\`
`,
  external: `
\`\`\`
import React from "react";
import { ExternalRecognition } from "speechless";

const getRecognition = blob =>
toBase64(blob)
  .then(base64data => base64data.substr(base64data.indexOf(',') + 1))
  .then(remoteCall)
  .then(res => res.json())
  .then(res => {
    if (!res || isEmpty(res)) {
      return ''
    }
    return res.results[0].alternatives[0].transcript
  })

class RecognitionInput extends React.PureComponent {
state = {
  data: "",
  fetching: false,
  listening: false,
};
constructor(props){
  super(props)
  const recognition = new ExternalRecognition("en", getRecognition)
  recognition.addEventListener("start", this.onStart); 
  recognition.addEventListener("fetching", this.onFetching);
  recognition.addEventListener("data", this.onData);
  recognition.addEventListener("end", this.onEnd);
}
onListen = () => {
  const { recognition } = this.props
  recognition.listen();
};
onFetching = e => {
  this.setState({ fetching: true, listening: false });
};
onStart = e => {
  this.setState({ listening: true });
};
onEnd = e => {
  this.setState({ fetching: false, listening: false });
};
onData = e => {
  this.setState({ data: e.detail });
};
renderButton() {
  const { fetching, listening } = this.state;
  if (fetching) {
    return <img src={loader} alt="fetching" />;
  }
  if (listening) {
    return <img src={recording} alt="recording" />;
  }
  return <img src={mic} alt="mic" />;
}
render() {
  const { data, fetching } = this.state;
  return (
    <div className="Input row">
        <input 
          disabled 
          placeholder="press the mic..." 
          name="msg" type="text" 
          value={data} />
        <button 
          disabled={fetching} 
          type="button" 
          onClick={this.onListen}>
          {this.renderButton()}
        </button>
    </div>
  );
}
}

\`\`\`
`,
  native: `
\`\`\`
import React from "react";
import { NativeRecognition } from "speechless";

class RecognitionInput extends React.PureComponent {
state = {
  data: "",
  fetching: false,
  listening: false,
};
constructor(props){
  super(props)
  const recognition = new NativeRecognition("en", getRecognition)
  recognition.addEventListener("start", this.onStart); 
  recognition.addEventListener("fetching", this.onFetching);
  recognition.addEventListener("data", this.onData);
  recognition.addEventListener("end", this.onEnd);
}
onListen = () => {
  const { recognition } = this.props
  recognition.listen();
};
onFetching = e => {
  this.setState({ fetching: true, listening: false });
};
onStart = e => {
  this.setState({ listening: true });
};
onEnd = e => {
  this.setState({ fetching: false, listening: false });
};
onData = e => {
  this.setState({ data: e.detail });
};
renderButton() {
  const { fetching, listening } = this.state;
  if (fetching) {
    return <img src={loader} alt="fetching" />;
  }
  if (listening) {
    return <img src={recording} alt="recording" />;
  }
  return <img src={mic} alt="mic" />;
}
render() {
  const { data, fetching } = this.state;
  return (
    <div className="Input row">
        <input 
          disabled 
          placeholder="press the mic..." 
          name="msg" type="text" 
          value={data} />
        <button 
          disabled={fetching} 
          type="button" 
          onClick={this.onListen}>
          {this.renderButton()}
        </button>
    </div>
  );
}
}
\`\`\`
`
};

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
            <div className="column center" disabled={NativeRecognition.isSupported()}>
              <RecognitionInput
                title={"Native recognition"}
                recognition={new NativeRecognition("en")}
                source={sources.native}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
