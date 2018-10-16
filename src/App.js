import React, { Component } from 'react';
import WebView from 'react-electron-web-view'
import Preferences from './dialogs/Preferences';
import Status from './dialogs/Status';
import Message from './dialogs/Message';

import './App.css';

const { ipcRenderer } = window.require('electron');

class App extends Component {

  constructor(props) {
    super(props);
    this.myRef = React.createRef();


  }

  componentDidMount() {

    ipcRenderer.on("logon:netflix", (e, preferences) => {
      const webview = this.myRef.current;
      if (webview) {

        const generateSetValue = (name, value) => {
          let code = 'var ele = document.getElementById("' + name + '");';
          code += 'ele.focus();';
          code += 'ele.value="' + value + '";';
          code += 'ele.focus();';
          return code;
        }

        const generateClick = (name)=> {
          let code = 'var ele = document.getElementById("' + name + '");';
          code += 'ele.click();';
          return code;
        };

        webview.executeJavaScript(generateSetValue('username', preferences.userEMail));
        webview.executeJavaScript(generateSetValue('password', preferences.userPassword));
        webview.executeJavaScript(generateClick('post-ok'));

        
      }

    });

    ipcRenderer.on("gettask:netflix", (e) =>{
      const webview = this.myRef.current;
      if (webview) {

        const generateCheckTasks = () => {
          let code = 'var ele = document.evaluate("//button[contains(text(), \'Get Task\')]", document, null, XPathResult.ANY_TYPE, null ).iterateNext();';
          code += 'if(ele){';
          code += 'ele.click();';
          code += 'Promise.resolve(true);';
          code += '} else {';
          code += 'Promise.resolve(false);';
          code += '}';
          return code;
        }

        
        webview.getWebContents().executeJavaScript(generateCheckTasks()).then((res) => {
          ipcRenderer.send("gettask:netflixResult", res);
        });
      }
    });

    // Check if there is a valid netflix task
    ipcRenderer.on("probe:netflix", (e) => {
      const webview = this.myRef.current;
      if (webview) {

        const generateCheckTasks = () => {
          let code = 'var ele = document.evaluate("//button[contains(text(), \'Get Task\')]", document, null, XPathResult.ANY_TYPE, null ).iterateNext();';
          code += 'if(ele){';
          code += 'Promise.resolve(true);';
          code += '} else {';
          code += 'Promise.resolve(false);';
          code += '}';
          return code;
        }

        
        webview.getWebContents().executeJavaScript(generateCheckTasks()).then((res) => {
          ipcRenderer.send("found:getTask", res);
        });
      }
    });

  }

  render() {
    const style = { width: '100%', height: '100%' };

    return (
      <div className="app">
        <WebView style={style} ref={this.myRef} className="webview" src="https://originator.backlot.netflix.com" nodeintegration>
        </WebView>
        <Preferences></Preferences>
        <Message></Message>
        <Status></Status>
      </div>
    );
  }
}

export default App;
