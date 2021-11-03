import React from 'react';
import { AutoComplete } from 'antd';
import { SEARCH_SUB_CATEGORY_ONLY  } from '../../../graphql/User/home_page';
import { client } from "../../../apollo";

const SearchSubcategory = props => {
    
    const [emails, setemails] = React.useState('');
    const [dataSource, setdataSource] = React.useState([]);
    const handleSearch = async value => {
        if(value){
            setemails(value);
        }else{
            onSelect(value);
        }
        if (value.length >= 1) {
            const { data } = await client.query({
                query: SEARCH_SUB_CATEGORY_ONLY,
                variables: { data: { value: value } },
                fetchPolicy: 'no-cache',
            });
            setdataSource(data ? data.search_sub_category_only : [])
        }
    };

    const onSelect = async value => {
        setemails(value);
        let data={};
        data[props.id]=value;
        props.passedFunction(data);
    }
    return (
        <div>
            <AutoComplete
                onSelect={onSelect}
                onSearch={handleSearch}
                placeholder={props.placeholder}
                value={emails}
                allowClear
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

export default SearchSubcategory;
