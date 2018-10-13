import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import './Panel.css';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

class Panel extends Component {

    static defaultProps = {
        center: {
          lat: 59.95,
          lng: 30.33
        },
        zoom: 11
      };

    render() {
        return (
            <div className="panel">
                <div>{this.props.children}</div>
                <GoogleMapReact className="map"
                    bootstrapURLKeys={{ key: 'AIzaSyALralOfiUTtzUGUNN5Oymuyor47IDaeHI' }}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}
                    
                >
                    <AnyReactComponent
                        lat={59.955413}
                        lng={30.337844}
                        text={'Crossfit'}
                    />


                    <AnyReactComponent
                        lat={60.955413}
                        lng={30.337844}
                        text={'Guy'}
                    />
                </GoogleMapReact>
            </div>
        );
    }
}

export default Panel;
