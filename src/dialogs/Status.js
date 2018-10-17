import React from 'react';
import './Status.css';

const { ipcRenderer } = window.require('electron');



export default class Status extends React.Component {

    constructor(props) {
        super(props);
        this.myRef = React.createRef();
        this.statusHandler = 0;
    }

    componentDidMount() {

        // If status bar is been requested
        ipcRenderer.on("set:statusBar", (e, text) => {
            const snackbar = this.myRef.current;
            if (snackbar) {
                clearTimeout(this.statusHandler);
                snackbar.innerText = text;
                snackbar.className = "show";
                this.statusHandler = setTimeout(() => { snackbar.className = ""; }, 3000);
            }
        });
    }

    componentWillUnmount() {
        ipcRenderer.removeAllListeners(['set:statusBar']);
    }

    render() {
        return (<div id="snackbar" ref={this.myRef}>...</div>);
    }
}
