import { PureComponent, createElement } from 'react';
import PropTypes from 'prop-types';

const withEvent = (eventKey, callback) => (BaseComponent) => {
  class EventComponent extends PureComponent {
    constructor (props, context) {
      super(props, context);
      this.eventName = typeof eventKey === 'function'
        ? eventKey(this.props)
        : eventKey;
      this.callback = callback;
      this.event = context.client.event;
      this.emit = this.event.emit;
    }

    componentDidMount () {
      this.event.subscribe(this.eventName, (...args) => {
        this.callback({ props: this.props }, ...args);
      });
    }

    componentWillUnmount () {
      this.event.unsubscribe(this.eventName);
    }

    render () {
      return createElement(BaseComponent, { ...this.props, ...{ emit: this.emit } });
    }
  }

  EventComponent.contextTypes = {
    client: PropTypes.any.isRequired
  };

  return EventComponent;
}

export default withEvent;
