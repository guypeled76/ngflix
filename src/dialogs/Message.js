import React from 'react';
import {
    Modal,
    Button
} from 'react-bootstrap'

const { ipcRenderer } = window.require('electron');

export default class Message extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            show: false,
            title: '',
            message: '',
            buttons : []
        };

    }

    componentDidMount() {
        ipcRenderer.on("show:message", (e, args) => {
            this.show(args.title, args.message, args.buttons);
        });
    }

    /**
     * Show the message dialog
     * @param {string} title 
     * @param {string} message 
     */
    show = (title, message, buttons) => {
        this.setState({
            show:true,
            title:title,
            message:message,
            buttons : buttons ? buttons : {text:'Close'}
        });
    }

    /**    
     * Close the message dialog
     */
    close = (action, args) => {
        this.setState({ show: false });
        if(action) {
            ipcRenderer.send(action, args);
        }
    }




    render() {
        return (<Modal show={this.state.show} onHide={this.close}>
            <Modal.Header closeButton>
                <Modal.Title>{this.state.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {this.state.message}
            </Modal.Body>
            <Modal.Footer>
                {this.state.buttons.map((button) => {
                    return (<Button onClick={()=>{this.close(button.action, button.args)}}>{button.text}</Button>);
                })}
            </Modal.Footer>
        </Modal>);
    }
}