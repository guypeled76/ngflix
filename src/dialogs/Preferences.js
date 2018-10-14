import React from 'react';
import {
    Modal,
    Button,
    Form,
    FormGroup,
    Col,
    FormControl,
    ControlLabel,
    Panel
} from 'react-bootstrap'
//import { ipcRenderer } from 'electron';


export default class Preferences extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            show: false,
            ngEMail: '',
            ngPassword: '',
            userEMail: '',
            userPassword: '',
            notificationEMail: ''
        };

    }

    /**
     * Show the preferences dialog
     * @param {object} preferences 
     */
    show = (preferences) => {
        this.setState({
            show: true,
            ngEMail: preferences.ngEMail,
            ngPassword: preferences.ngPassword,
            userEMail: preferences.userEMail,
            userPassword: preferences.userPassword,
            notificationEMail: preferences.notificationEMail
        });
    }

    /**    
     * Close the preferences dialog
     */
    close = () => {
        this.setState({show:false});
    }

    /**
     * Save the preferences
     */
    save = () => {

        /*ipcRenderer.send('save:preferences', {
            ngEMail: this.state.ngEMail,
            ngPassword: this.state.ngPassword,
            userEMail: this.state.userEMail,
            userPassword: this.state.userPassword,
            notificationEMail: this.state.notificationEMail
        });*/
        this.setState({show:false});
    }

    ngPasswordChange = (e) => {
        this.setState({ngPassword:e.target.value});
    }

    ngEMailChange = (e) => {
        this.setState({ngEMail:e.target.value});
    }

    userEMailChange = (e) => {
        this.setState({userEMail:e.target.value});
    }

    userPasswordChange = (e) => {
        this.setState({userPassword:e.target.value});
    }

    notificationEMailChange = (e) => {
        this.setState({notificationEMail:e.target.value});
    }

    render() {
        return (<Modal show={this.state.show} onHide={this.close}>
            <Modal.Header closeButton>
                <Modal.Title>Preferences</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form horizontal>
                    <Panel>
                        <Panel.Heading>NG Notifier</Panel.Heading>
                        <Panel.Body><FormGroup controlId="ngEMail">
                            <Col componentClass={ControlLabel} sm={2}>
                                Email
                            </Col>
                            <Col sm={10}>
                                <FormControl type="email" placeholder="Email" value={this.state.ngEMail} onChange={this.ngEMailChange} />
                            </Col>
                        </FormGroup>

                            <FormGroup controlId="ngPassword">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Password
                            </Col>
                                <Col sm={10}>
                                    <FormControl type="password" placeholder="Password" value={this.state.ngPassword} onChange={this.ngPasswordChange} />
                                </Col>
                            </FormGroup></Panel.Body>
                    </Panel>

                    <Panel>
                        <Panel.Heading>User</Panel.Heading>
                        <Panel.Body><FormGroup controlId="userEMail">
                            <Col componentClass={ControlLabel} sm={2}>
                                Email
                            </Col>
                            <Col sm={10}>
                                <FormControl type="email" placeholder="Email" value={this.state.userEMail} onChange={this.userEMailChange} />
                            </Col>
                        </FormGroup>

                            <FormGroup controlId="userPassword">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Password
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="password" placeholder="Password" value={this.state.userPassword} onChange={this.userPasswordChange} />
                                </Col>
                            </FormGroup></Panel.Body>
                    </Panel>
                    
                    <Panel>
                        <Panel.Heading>Notifications</Panel.Heading>
                        <Panel.Body>
                            <FormGroup controlId="notificationEMail">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Email
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="email" placeholder="Email" value={this.state.notificationEMail} onChange={this.notificationEMailChange} />
                                </Col>
                            </FormGroup>
                        </Panel.Body>
                    </Panel>

                </Form>

            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.close}>Close</Button>
                <Button onClick={this.save}>Save</Button>
            </Modal.Footer>
        </Modal>);
    }
}