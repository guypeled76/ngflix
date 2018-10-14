import React, { Component } from 'react';
import Preferences from './dialogs/Preferences';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.myRef = React.createRef();

  }

  editPreferences = () => {
    this.myRef.current.show({});
  }

  render() {
    return (
      <div className="App">
        <button onClick={this.editPreferences}>Show</button>
        <Preferences ref={this.myRef}></Preferences>
      </div>
    );
  }
}

export default App;
