import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { RecognitionFactory, ExternalRecognition } from 'speechless'

import loader from '../../Assets/loader.svg'
import recording from '../../Assets/recording.svg'
import mic from '../../Assets/mic.svg'

import './style.css'
import { AbstractRecognition } from 'speechless/dist/types/AbstractRecognition'

function remoteCall(content) {
  return fetch(
    'https://content-speech.googleapis.com/v1/speech:recognize?alt=json&key=AIzaSyBW2ROnSfou8fo0J7Pa-B2uPq3U45V-jnk',
    {
      method: 'post',
      body: JSON.stringify({
        config: {
          encoding: 'LINEAR16',
          sampleRateHertz: 44100,
          languageCode: 'en',
          maxAlternatives: 1
        },
        audio: {
          content
        }
      })
    }
  )
}
function toBase64(blob) {
  var reader = new window.FileReader()
  return new Promise(resolve => {
    reader.readAsDataURL(blob)
    reader.onloadend = function() {
      resolve(reader.result)
    }
  })
}
function isEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false
  }
  return true
}
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

export default class Header extends PureComponent {
  static propTypes = {
    recognition: PropTypes.instanceOf(AbstractRecognition)
  }
  state = {
    data: '',
    fetching: false,
    listening: false
  }
  constructor(props) {
    super(props)
  }
  componentDidMount = () => {
    const { recognition } = this.props
    recognition.addEventListener('data', this.onData)
    recognition.addEventListener('fetching', this.onFetching)
    recognition.addEventListener('start', this.onStart)
    recognition.addEventListener('end', this.onEnd)
  }
  componentWillReceiveProps = nextProps => {
    const { recognition } = nextProps
    recognition.addEventListener('data', this.onData)
    recognition.addEventListener('fetching', this.onFetching)
    recognition.addEventListener('start', this.onStart)
    recognition.addEventListener('end', this.onEnd)
  }

  onListen = () => {
    const { recognition } = this.props

    recognition.listen()
  }
  onFetching = e => {
    this.setState({ fetching: true, listening: false })
  }
  onStart = e => {
    this.setState({ listening: true })
  }
  onEnd = e => {
    this.setState({ fetching: false, listening: false })
  }
  onData = e => {
    this.setState({ data: e.detail })
  }
  renderButton() {
    const { fetching, listening } = this.state
    if (fetching) {
      return <img src={loader} alt="fetching" />
    }
    if (listening) {
      return <img src={recording} alt="recording" />
    }
    return <img src={mic} alt="mic" />
  }
  render() {
    const { data, fetching } = this.state
    return (
      <div className="Input">
        <div className="row middle">
          <input disabled placeholder="press the mic..." name="msg" type="text" value={data} />
          <button disabled={fetching} type="button" onClick={this.onListen}>
            {this.renderButton()}
          </button>
        </div>
      </div>
    )
  }
}
