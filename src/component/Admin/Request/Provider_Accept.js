import React from "react";
import { Table, Form, Tag } from 'antd';
import { GET_BOOKING } from '../../../graphql/Admin/booking';
import { client } from "../../../apollo";

class ProviderAccept extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            dataSource: [],
            update_data: {},
            update: 0,
            loading: false,
            loading_img: false,
            imageUrl: '',
            file: {},
            previewVisible: false,
            previewImage: '',
            pagination: {
                pageSize: 10,
                current: 1,
                total: 0,
                simple: true,
            }
        };
    }

    componentDidMount() {
        this.fetch_booking();
    }
    handleTableChange = async pagination => {
        const pager = { ...pagination };
        pager.current = pagination.current;
         this.setState({ loading: true });

        await client.query({
            query: GET_BOOKING,
            variables: { limit: pager.pageSize, page: pager.current, booking_status: [9] },
            fetchPolicy: 'no-cache',
        }).then(result => {
            console.log(result.data);
            const pagination = { ...this.state.pagination };
            pagination.total = result.data.get_booking.pageInfo.totalDocs;
            pagination.current = result.data.get_booking.pageInfo.page;
            console.log(pagination);
            this.setState({ pagination, loading: false, dataSource: result.data.get_booking.data });
        });
    };


    fetch_booking = async() => {
        this.setState({ loading: true });
        await client.query({
            query: GET_BOOKING,
            variables: { limit: this.state.pagination.pageSize, page: this.state.pagination.current, booking_status:[9] },
            fetchPolicy: 'no-cache',
        }).then(result => {
            const pagination = { ...this.state.pagination };
            pagination.total = result.data.get_booking.pageInfo.totalDocs;
            this.setState({loading:false, pagination, dataSource: result.data.get_booking.data });
        });
    }

    delete_booking=(_id)=>{
        console.log(_id);
    }

    render() {
        const columns = [
            {
                title: 'User',
                width: '15%',
                editable: true,
                render: (text, record) => {
                    console.log(record);
                    return <span title="User">{record.booking_user[0] ? record.booking_user[0].name : ''}</span>;
                },
            },
            {
                title: 'Provider',
                width: '15%',
                editable: true,
                render: (text, record) => {
                    return <span title="Provider">{record.booking_provider[0] ? record.booking_provider[0].name : 'Not Assign'}</span>;
                },
            },
            {
                title: 'Sub Category',
                width: '15%',
                editable: true,
                render: (text, record) => {
                        return <span title="Sub Category">{
                                record.booking_category[0] ? record.booking_category[0].subCategory_name ? record.booking_category[0].subCategory_name: 'Main Category':'Main Category' 
                        }</span>;

                },
            },
            {
                title: 'Category',
                width: '15%',
                editable: true,
                render: (text, record) => {
                    if(record.category_type === "2"){
                        console.log("dosd");
                        return <>
                        <span title="Category">{record.booking_category[0] ?
                         record.booking_category[0].booking_parent_category[0]? 
                         record.booking_category[0].booking_parent_category[0].category_name:"":""}</span>
                        </>
                    }else{
                        return <span title="Category">{record.booking_category[0] ? record.booking_category[0].category_name:""}</span>
                    }
                },
            },
            {
                title: 'Booked',
                width: '15%',
                editable: true,
                render: (text, record) => {
                    return <span title="Booked">{record.booking_date}</span>;
                },
            },
            {
                title: 'Status',
                width: '15%',
                editable: true,
                render: (text, record) => {
                    // booking==12,provider_cancel==8,provider_accept==9,user_accept==10,user_cancel==11,end==13,complete=14, 
                    if(record.booking_status === 9){
                        return <span title="Status"> <Tag color="cyan">Provider Accept</Tag> </span>;
                    }
                },
            },
        
        ];
        const { dataSource } = this.state;
        return (
            <React.Fragment>
                  <div id="no-more-tables">
                <Table
                    rowClassName={() => 'editable-row'}
                    className='table_shadow'
                    dataSource={dataSource}
                    columns={columns}
                    size="middle"
                    pagination={this.state.pagination}
                    onChange={this.handleTableChange}
                    loading={this.state.loading}
                />
                </div>
            </React.Fragment>
        );
    }
}

export default Form.create()(ProviderAccept);