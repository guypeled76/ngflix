import React, { Component } from 'react';
import Preferences from './dialogs/Preferences';
import Status from './dialogs/Status';

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div className="App">
        <Preferences></Preferences>
        <Status></Status>
      </div>
    );
  }
}

export default App;
