import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import './style.css'

export class Event extends PureComponent {
  static propTypes = {
    time: PropTypes.string,
    type: PropTypes.string
  }
  shouldComponentUpdate = (nextProps, nextState) => {
    return false
  }

  render() {
    const { time, type } = this.props
    return (
      <div className="Event row middle">
        <div className="_time">{time}</div>
        <div className="_type">{type}</div>
      </div>
    )
  }
}

export default class EventsLog extends PureComponent {
  static propTypes = {
    events: PropTypes.array
  }
  render() {
    const { events } = this.props
    return (
      <div className={'EventsLog'}>
        {events.map(event => <Event key={event.time} time={event.time} type={event.ev.type} />)}
      </div>
    )
  }
}
