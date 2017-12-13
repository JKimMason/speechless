import React, { PureComponent } from "react";
import PropTypes from "prop-types";

import "./style.css";

export default class EventsLog extends PureComponent {
  static propTypes = {
    events: PropTypes.array
  };
  componentWillReceiveProps = nextProps => {
    const { events } = this.props;
    if (events.length < nextProps.events.length && this.eventsLog) {
      this.eventsLog.scrollTop = this.eventsLog.scrollHeight;
    }
  };

  renderEvent = (event, idx) => {
    return (
      <div className="Event" key={event.ev.timeStamp}>
        {event.time} - {event.ev.type}
      </div>
    );
  };
  render() {
    const { events } = this.props;
    return (
      <div
        className="EventsLog"
        ref={el => {
          this.eventsLog = el;
        }}
      >
        {events.map(this.renderEvent)}
      </div>
    );
  }
}
