import React, { Component } from 'react';
import WebView from 'react-electron-web-view'
import Preferences from './dialogs/Preferences';
import Status from './dialogs/Status';

import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

  }

  render() {
    const style = { width: '100%', height: '100%' };

    return (
      <div className="app">
        <WebView style={style} className="webview" src="https://originator.backlot.netflix.com" preload="./inject.js">
        </WebView>
        <Preferences></Preferences>
        <Status></Status>
      </div>
    );
  }
}

export default App;
