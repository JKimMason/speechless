import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'

import ReactMarkdown from 'react-markdown'

import CodeBlock from '../CodeBlock'

import EventsLog from '../EventsLog'
import loader from '../../Assets/img/loader.svg'
import recording from '../../Assets/img/recording.svg'
import mic from '../../Assets/img/mic.svg'

import './style.css'

export default class RecognitionInput extends PureComponent {
  static propTypes = {
    recognition: PropTypes.object,
    title: PropTypes.string,
    source: PropTypes.string
  }
  state = {
    data: '',
    fetching: false,
    listening: false,
    events: []
  }

  componentDidMount = () => {
    const { recognition } = this.props
    recognition.addEventListener('data', this.onData)
    recognition.addEventListener('fetching', this.onFetching)
    recognition.addEventListener('start', this.onStart)
    recognition.addEventListener('end', this.onEnd)

    recognition.addEventListener('data', this.onEvent)
    recognition.addEventListener('fetching', this.onEvent)
    recognition.addEventListener('start', this.onEvent)
    recognition.addEventListener('end', this.onEvent)
  }
  onEvent = ev => {
    this.setState(prevState => ({
      ...prevState,
      events: [{ ev, time: moment().format('hh:mm:ss:SSSSS') }, ...prevState.events]
    }))
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
    const { data, fetching, events } = this.state
    const { title, source, disabled } = this.props

    return (
      <div className="Input column" disabled={disabled}>
        <div className="column">
          <h3>{title}</h3>
        </div>
        <div className="row">
          <div className="column">
            <div className="row middle">
              <input disabled placeholder="press the mic..." name="msg" type="text" value={data} />
              <button disabled={disabled || fetching} type="button" onClick={this.onListen}>
                {this.renderButton()}
              </button>
            </div>
            <div className="column">
              <EventsLog events={events} />
            </div>
          </div>
          <div className="column source">
            <ReactMarkdown source={source} renderers={{ code: CodeBlock }} />
          </div>
        </div>
      </div>
    )
  }
}
