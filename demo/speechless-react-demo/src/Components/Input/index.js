import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import loader from '../../Assets/loader.svg'
import recording from '../../Assets/recording.svg'
import mic from '../../Assets/mic.svg'

import './style.css'



export default class Input extends PureComponent {
  static propTypes = {
    recognition: PropTypes.object
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
