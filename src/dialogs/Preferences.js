import React from 'react';
import {
    Modal,
    Button,
    Form,
    FormGroup,
    Col,
    FormControl,
    ControlLabel,
    Tab,
    Tabs
} from 'react-bootstrap'

const { ipcRenderer } = window.require('electron');

const tabStyle =  {paddingTop:'10px'};

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

    componentDidMount() {
        ipcRenderer.on("edit:preferences", (e, preferences) => {
            this.show(preferences);
        });
    }

    /**
     * Show the preferences dialog
     * @param {object} preferences 
     */
    show = (preferences) => {
        this.setState(Object.assign({},{show:true}, preferences));
    }

    /**    
     * Close the preferences dialog
     */
    close = () => {
        this.setState({ show: false });
    }

    /**
     * Save the preferences
     */
    save = () => {

        ipcRenderer.send('save:preferences', {
            ngEMail: this.state.ngEMail,
            ngPassword: this.state.ngPassword,
            userEMail: this.state.userEMail,
            userPassword: this.state.userPassword,
            notificationEMail: this.state.notificationEMail
        });
        this.setState({ show: false });
    }

    ngPasswordChange = (e) => {
        this.setState({ ngPassword: e.target.value });
    }

    ngEMailChange = (e) => {
        this.setState({ ngEMail: e.target.value });
    }

    userEMailChange = (e) => {
        this.setState({ userEMail: e.target.value });
    }

    userPasswordChange = (e) => {
        this.setState({ userPassword: e.target.value });
    }

    notificationEMailChange = (e) => {
        this.setState({ notificationEMail: e.target.value });
    }

    render() {

        
        return (<Modal show={this.state.show} onHide={this.close}>
            <Modal.Header closeButton>
                <Modal.Title>Preferences</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form horizontal>
                    <Tabs defaultActiveKey={1}  id="preferences-tabs">
                        <Tab eventKey={1}  title="NG Notifier" style={tabStyle}>
                            <FormGroup controlId="ngEMail">
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
                            </FormGroup>
                        </Tab>
                        <Tab eventKey={2} title="User" style={tabStyle}>
                            <FormGroup controlId="userEMail">
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
                            </FormGroup>
                        </Tab>
                        <Tab eventKey={3} title="Notifications" style={tabStyle}>
                            <FormGroup controlId="notificationEMail">
                                <Col componentClass={ControlLabel} sm={2}>
                                    Email
                                </Col>
                                <Col sm={10}>
                                    <FormControl type="email" placeholder="Email" value={this.state.notificationEMail} onChange={this.notificationEMailChange} />
                                </Col>
                            </FormGroup>
                        </Tab>
                    </Tabs>
                </Form>

            </Modal.Body>
            <Modal.Footer>
                <Button onClick={this.close}>Close</Button>
                <Button onClick={this.save}>Save</Button>
            </Modal.Footer>
        </Modal>);
    }
}