import React from 'react'
import { useLocation } from "react-router";
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Icon, Empty, List, Skeleton, Button } from 'antd';
import gql from 'graphql-tag';
import { LocationContext, EditLocationContext } from '../../context/Location'
import { Alert_msg } from "../../Comman/alert_msg";

const GET_ADDRESS = gql`
query ADDRESS($user_id: ID) {
  user_address(user_id: $user_id) {
      _id
    title
    flat_no
    landmark
    address
    lat
    lng
  }
}
`;

const DELETE_ADDRESS = gql`
  mutation delete_address($option: Int,$_id: ID) {
     modified_address(option:$option,_id:$_id ) {
        msg
        status
    }
  }
`;



const SetAddress = () => {
    let location = useLocation();

    const { loading, error, data } = useQuery(GET_ADDRESS, {
        variables: { user_id: JSON.parse(localStorage.getItem('user'))._id },
    });
    const [delete_address, { loading: removeLoading }] = useMutation(DELETE_ADDRESS, {
        refetchQueries: [{ query: GET_ADDRESS, variables: { user_id: JSON.parse(localStorage.getItem('user'))._id } }],
        awaitRefetchQueries: true,
    });

    if (loading) return <Skeleton />;
    if (removeLoading) return <Skeleton />;
    if (error) return `Error! ${error.message}`;

    //  delete saved address 
    const delete_data = (item) => {
        console.log(item)
        var data = {
            option: 3,
            _id: item._id,
        };
        delete_address({ variables: data }).then(results => {
            console.log(results)
            if (results.data.modified_address.status === 'success') {
                Alert_msg({ msg: "Delete success", status: "success" });
            } else {
                Alert_msg({ msg: "Delete failed", status: "failed" });
            }
        });
    }
    const loader = (values) => {
        values.no_data();
    }
    return (
        <LocationContext.Consumer>
            {
                (value) => {
                    return (
                        <EditLocationContext.Consumer>
                            {
                                (values) => {
                                    return (
                                        <>
                                            {data.user_address.length === 0 ?
                                                <>
                                                    {loader(values)}
                                                    <Empty className="m-5" description={false} />
                                                </> :
                                                <>
                                                    {/* <div>SAVED ADDRESS</div> */}
                                                    <List
                                                        itemLayout="horizontal"
                                                        dataSource={data.user_address}
                                                        renderItem={item => (
                                                            <List.Item
                                                                className='cursor_point'
                                                                actions={[
                                                                    <Button type="link primary_color d-flex" size="small"
                                                                        onClick={() => { values.location_edit(item) }} >
                                                                        <Icon type="edit" /> edit
                                                                    </Button>,
                                                                    <Button type="link primary_color d-flex" size="small" onClick={() => { delete_data(item) }}>
                                                                        <Icon type="delete" /> delete
                                                                    </Button>
                                                                ]}
                                                            >
                                                                <Skeleton avatar title={true} loading={item.loading} active>
                                                                    <List.Item.Meta
                                                                        onClick={() => {
                                                                            if (location.pathname !== '/profile') {
                                                                                value.location_change(item)
                                                                            }
                                                                        }}
                                                                        avatar={item.title === 'Work' ?
                                                                            <Icon className="f_25 ml-3 mt-1" type="shop" /> :
                                                                            item.title === 'Home' ? <Icon className="f_25 ml-3 mt-1" type="home" /> :
                                                                                <Icon className="f_25 ml-3 mt-1" type="security-scan" />}
                                                                        title={item.title}
                                                                        description={item.address}
                                                                    />
                                                                </Skeleton>
                                                            </List.Item>
                                                        )}
                                                    />

                                                </>
                                            }
                                        </>
                                    )
                                }}
                        </EditLocationContext.Consumer>
                    )
                }}
        </LocationContext.Consumer >

    );
}

export default SetAddress;
