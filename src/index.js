import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'semantic-ui-css/semantic.min.css';

// Import Deepstream
import Deepstream from './deepstream/Deepstream';

ReactDOM.render(
  <Deepstream url='ws://localhost:6020/deepstream'>
    <App />
  </Deepstream>
, document.getElementById('root'));
