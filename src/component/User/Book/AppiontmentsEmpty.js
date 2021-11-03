import React from 'react'
import noimg from '../../../image/no_booking.png';
import {Empty} from 'antd';

export default function AppiontmentsEmpty() {
    return (
        <>
            <Empty
                image={noimg}
                imageStyle={{ height: 200, objectFit: " scale-down" }}
                description={ <span className="bold">You have no bookings (Search Service)</span>}
            />
        </>
    )
}
