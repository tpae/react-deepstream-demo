import { PureComponent, createElement } from 'react';
import PropTypes from 'prop-types';

const withList = (listKey, propName, handlers, fetchEntries = true) => (BaseComponent) => {
  class ListComponent extends PureComponent {
    constructor (props, context) {
      super(props, context);

      this.listName = typeof listKey === 'function'
        ? listKey(this.props)
        : listKey;

      this.propName = propName || this.listName;
      this.list = context.client.record.getList(this.listName);
      this.subscribeToChanges = this.subscribeToChanges.bind(this);
      this.state = { [this.propName]: [] };
      this.cachedHandlers = {};

      this.handlers = mapValues(
        typeof handlers === 'function' ? handlers(this.props) : handlers,
        (createHandler, handlerName) => (...args) => {
          const cachedHandler = this.cachedHandlers[handlerName];
          if (cachedHandler) {
            return cachedHandler(...args);
          }
          const handler = createHandler(context.client, this.list, this.props);
          this.cachedHandlers[handlerName] = handler;
          return handler(...args);
        }
      )
    }

    subscribeToChanges (changes) {
      this.cachedHandlers = {};

      // we fetch entries (records) with promises to handle
      // asynchronous operations.
      if (fetchEntries) {
        let records = changes.map(recordKey => {
          return new Promise(resolve => {
            const record = this.context.client.record.getRecord(recordKey);
            record.whenReady(record => {
              resolve(record.get());
            });
          });
        });

        if (records.length > 0) {
          return Promise.all(records).then(results => this.setState({ [this.propName]: results }));
        }
      }

      return this.setState({ [this.propName]: changes });
    }

    componentDidMount () {
      this.list.whenReady(list => {
        this.list.subscribe(this.subscribeToChanges, true);
      });
    }

    componentWillUnmount () {
      setTimeout(this.list.discard, 0);
    }

    render () {
      return createElement(BaseComponent, { ...this.props, ...this.state, ...this.handlers });
    }
  }

  ListComponent.contextTypes = {
    client: PropTypes.any.isRequired
  };

  return ListComponent;
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

export default withList;
