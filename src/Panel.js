import React, { Component } from 'react';
import './Panel.css';


class Panel extends Component {



    render() {
        return (
            <div className="panel">
                <div>{this.props.children}</div>                
            </div>
        );
    }
}

export default Panel;
