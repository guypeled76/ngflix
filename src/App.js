import React, { Component } from 'react';
import Preferences from './dialogs/Preferences';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Preferences></Preferences>
      </div>
    );
  }
}

export default App;
