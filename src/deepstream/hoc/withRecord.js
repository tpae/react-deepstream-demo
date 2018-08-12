import { PureComponent, createElement } from 'react'
import PropTypes from 'prop-types'

// Higher-Order function to handle Deepstream records.
// Relies on parent context with Deepstream client.
// handlers: (client, record, props) => { ... }
const withRecord = (recordKey, propName, handlers) => (BaseComponent) => {
  class RecordComponent extends PureComponent {
    constructor (props, context) {
      super(props, context);
      // initialization, set variables
      this.recordName = typeof recordKey === 'function'
        ? recordKey(this.props)
        : recordKey;
      this.propName = propName || this.listName;

      // retrieve record from client
      this.record = context.client.record.getRecord(this.recordName);

      // bind subscribe to changes function
      this.subscribeToChanges = this.subscribeToChanges.bind(this);

      // initialize empty state
      this.state = {};

      // cache handler functions
      this.cachedHandlers = {};

      // initialize handlers
      this.handlers = mapValues(
        typeof handlers === 'function' ? handlers(this.props) : handlers,
        (createHandler, handlerName) => (...args) => {
          const cachedHandler = this.cachedHandlers[handlerName];

          if (cachedHandler) {
            return cachedHandler(...args);
          }

          const handler = createHandler(context.client, this.record, this.props);
          this.cachedHandlers[handlerName] = handler;
          return handler(...args);
        }
      );
    }

    // function to set state based on changes from Deepstream
    subscribeToChanges (changes) {
      this.setState({ [this.propName]: changes });
      this.cachedHandlers = {};
    }

    // on componentDidMount, we subscribe to changes
    componentDidMount () {
      this.record.whenReady(record => {
        this.record.subscribe(this.subscribeToChanges, true);
      });
    }

    // when componentWillUnmount, we discard the record instance
    componentWillUnmount () {
      setTimeout(this.record.discard, 0);
    }

    // HoC: pass state as props to new owner
    render () {
      return createElement(BaseComponent, { ...this.props, ...this.state, ...this.handlers });
    }
  }

  RecordComponent.contextTypes = {
    client: PropTypes.any.isRequired
  };

  return RecordComponent;
}

function mapValues (obj, func) {
  const result = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = func(obj[key], key)
    }
  }
  return result;
}

export default withRecord;
