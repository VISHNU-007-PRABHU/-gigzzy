import React from 'react';
import { AutoComplete } from 'antd';
import { USER_EMAIL_QUERY  } from '../../../graphql/Admin/user';
import { client } from "../../../apollo";

const EmailSearch = props => {
    
    const [emails, setemails] = React.useState('');
    const [dataSource, setdataSource] = React.useState([]);
    
    const handleSearch = async value => {
        if(value){
            setemails(value);
        }else{
            onSelect(value);
        }
        console.log(value);
        var datas ={}
        datas[props.value] = { $regex: value ,$options: 'i'}
        datas['role']=Number(props.role);
        datas['delete']=0;
        if (value.length >= 1) {
            const { data } = await client.query({
                query: USER_EMAIL_QUERY,
                variables: { data:datas },
                fetchPolicy: 'no-cache',
            });
            setdataSource(data ? data.user_search : [])
        }
    };

    const onSelect = async value => {
      
        setemails(value);
       
        var pass_value={}
        if(props.role === 1){
            pass_value['user_id']=value;
        }else{
            pass_value['provider_id']=value;
        }
        props.passedFunction(pass_value);
    }
    return (
        <div>
            <AutoComplete
                onSelect={onSelect}
                onSearch={handleSearch}
                placeholder={props.placeholder}
                value={emails}
                allowClear
                autoClearSearchValue	
                className="border"
            >
                {dataSource.map((user, index) => {
                    return (
                        <AutoComplete.Option key={user._id}>
                            {user[props.value]}
                        </AutoComplete.Option>
                    );
                })}
            </AutoComplete>
        </div>
    )
}

export default EmailSearch;
