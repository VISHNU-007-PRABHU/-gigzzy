import React from 'react';
import { AutoComplete } from 'antd';
import { SEARCH_CATEGORY_ONLY  } from '../../../graphql/User/home_page';
import { client } from "../../../apollo";

const SearchCategory = props => {
    
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
                query: SEARCH_CATEGORY_ONLY,
                variables: { data: { value: value } },
                fetchPolicy: 'no-cache',
            });
            setdataSource(data ? data.search_category_only : [])
        }
    };

    const onSelect = async value => {
        setemails(value);
        props.passedFunction({category_id:value});
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

export default SearchCategory;
