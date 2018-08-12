import { Component, Children } from 'react';
import PropTypes from 'prop-types';
import deepstream from 'deepstream.io-client-js';

// factory function to return Deepstream component with values
export function createDeepstream () {
  class Deepstream extends Component {
    constructor (props, context) {
      super(props, context);
      // initialize deepstream client
      this.client = deepstream(props.url, props.options).login();
    }

    getChildContext () {
      // set client as a context!
      return { client: this.client };
    }

    render () {
      // render children
      return Children.only(this.props.children);
    }
  }

  Deepstream.propTypes = {
    url: PropTypes.string.isRequired,
    options: PropTypes.object,
    children: PropTypes.element.isRequired
  };

  Deepstream.childContextTypes = {
    client: PropTypes.any.isRequired
  };

  Deepstream.displayName = 'Deepstream';

  return Deepstream;
}

export default createDeepstream();
