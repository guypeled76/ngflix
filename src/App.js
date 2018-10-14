import React, { Component } from 'react';
import WebView from 'react-electron-web-view'
import Preferences from './dialogs/Preferences';
import Status from './dialogs/Status';

import './App.css';

const { ipcRenderer } = window.require('electron');

class App extends Component {

  constructor(props) {
    super(props);
    this.myRef = React.createRef();


  }

  componentDidMount() {

    const webview = this.myRef.current;
    if (webview) {

      ipcRenderer.on("logon:netflix", function (e, preferences) {
        alert(1);
          webview.send("logon:netflix", preferences);
      });

      ipcRenderer.on("probe:netflix", function (e) {
          webview.send("probe:netflix");
      });
    }
  }

  render() {
    const style = { width: '100%', height: '100%' };
    const temp = "file://~/Projects/ElctronJS/ngflix/public/inject.js";
    return (
      <div className="app">
        <WebView style={style}  ref={this.myRef} className="webview" src="https://originator.backlot.netflix.com" preload={temp}>
        </WebView>
        <Preferences></Preferences>
        <Status></Status>
      </div>
    );
  }
}

export default App;
