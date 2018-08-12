import React, { Component } from 'react';
import RecordExample from './RecordExample';
import Board from './Board';
import RealTimeBoard from './RealTimeBoard';

function App() {
  return (
    <div className="ui container" style={{ marginTop: '5em' }}>
      <RealTimeBoard />
      <RecordExample />
    </div>
  )
}

export default App;
