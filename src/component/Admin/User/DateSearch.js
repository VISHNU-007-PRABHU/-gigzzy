import React from 'react';
import { DatePicker } from 'antd';
import { client } from "../../../apollo";
import moment from 'moment';

const DateSearch = props => {

    const [emails, setemails] = React.useState('');
    const [dataSource, setdataSource] = React.useState([]);

    const onChange = async (value, dateString) => {
     
        // start today
        var start = moment.utc(dateString).format('YYYY-MM-DD');
        // end today
        var end = moment.utc(dateString).format('YYYY-MM-DD')+' 23:59:59';
        let data={};
        if(dateString){
            data = { '$gte': start, '$lte': end };
        }else{
            data="";
        }
        props.passedFunction({ booking_date: data });
    }
    return (
        <div>
            <DatePicker onChange={onChange} />
        </div>
    )
}

export default DateSearch;
