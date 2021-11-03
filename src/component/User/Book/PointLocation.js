import React from 'react'
import {  Modal } from 'antd';
import GoogleMapReact from 'google-map-react';

export default function PointLocation(props) {
    const [direction,setdirection]=React.useState(false);
    React.useEffect(() => {
        setdirection(props.direction);
    }, [props])
    return (
        <div>
            <Modal
                title="Loction"
                className="new_modal direction"
                visible={direction}
                onCancel={() => {setdirection(false);props.close_direction_model()}}
            >
                <div style={{ height: '70vh', width: '100%' }}>
                    <GoogleMapReact
                        draggable={true}
                        center={[9.9619289, 78.1288218]}
                        zoom={12}
                        // options={mapOptions}
                    >
                        <div
                            className="place"
                            lat={props?.user_lat}
                            lng={props?.user_lng}>
                            <img src={require("../../../image/location_green.png")} alt="your Place" />
                        </div>
                        <div
                            className="place"
                            lat={props?.porvider_lat}
                            lng={props?.porvider_lng}>
                            <img src={require("../../../image/pin_location.png")} alt="your Place" />
                        </div>
                    </GoogleMapReact>
                </div>
            </Modal>
        </div>
    )
}
