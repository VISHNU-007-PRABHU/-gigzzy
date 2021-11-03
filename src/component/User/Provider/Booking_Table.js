import React from "react";
import { withRouter } from "react-router-dom";
import { Table, Form, Icon, Tag } from 'antd';
import { GET_PROVIDER_BOOKING } from '../../../graphql/Admin/booking';

import { client } from "../../../apollo";

class Booking_Table extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id:"",
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
        // this.setState({ id: });
       this.fetch_booking();
    }
    handleTableChange =async pagination => {
        const pager = { ...pagination };
        pager.current = pagination.current;
        this.setState({ loading: true });
        await client.query({
            query: GET_PROVIDER_BOOKING,
            variables: { limit: pager.pageSize, page: pager.current, provider_id: JSON.parse(localStorage.getItem('provider'))._id , booking_status: [13,14] },
            fetchPolicy: 'no-cache',
        }).then(result => {
            console.log(result.data);
            const pagination = { ...this.state.pagination };
            pagination.total = result.data.get_booking.pageInfo.totalDocs;
            pagination.current = result.data.get_booking.pageInfo.page;
            console.log(pagination);
            this.setState({loading:false, pagination, dataSource: result.data.get_booking.data });
        });
    };


    fetch_booking =async() => {
        this.setState({loading:true});
        await client.query({
            query: GET_PROVIDER_BOOKING,
            variables: { limit: this.state.pagination.pageSize, page: this.state.pagination.current, provider_id: JSON.parse(localStorage.getItem('provider'))._id, booking_status:[13,14] },
            fetchPolicy: 'no-cache',
        }).then(result => {
            const pagination = { ...this.state.pagination };
            pagination.total = result.data.get_booking.pageInfo.totalDocs;
            this.setState({ loading:false, pagination, dataSource: result.data.get_booking.data });
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
                fixed: 'left',
                editable: true,
                render: (text, record) => {
                    console.log(record);
                    return <span title="booking name">{record.booking_user[0] ? record.booking_user[0].name : ''}</span>;
                },
            },
            {
                title: 'Provider',
                width: '15%',
                editable: true,
                render: (text, record) => {
                    return <span title="booking name">{record.booking_provider[0] ? record.booking_provider[0].name : 'Not Assign'}</span>;
                },
            },
            {
                title: 'Sub Category',
                width: '15%',
                editable: true,
                render: (text, record) => {
                        return <span title="booking name">{
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
                        <span title="booking name">{record.booking_category[0] ?
                         record.booking_category[0].booking_parent_category[0]? 
                         record.booking_category[0].booking_parent_category[0].category_name:"":""}</span>
                        </>
                    }else{
                        return <span title="booking name">{record.booking_category[0] ? record.booking_category[0].category_name:""}</span>
                    }
                },
            },
            {
                title: 'Booked',
                width: '15%',
                editable: true,
                render: (text, record) => {
                    return <span title="booking name">{record.booking_date}</span>;
                },
            },
            {
                title: 'Status',
                width: '15%',
                editable: true,
                render: (text, record) => {
                    // booking==12,provider_cancel==8,provider_accept==9,user_accept==10,user_cancel==11,end==13,complete=14, 
                    if(record.booking_status === 13){
                        return <span title="booking name"> <Tag color="cyan">End</Tag> </span>;
                    }else if(record.booking_status === 14){
                        return <span title="booking name"> <Tag color="cyan">Complete</Tag> </span>;
                    }
                },
            },
            {
                title: 'Action',
                dataIndex: 'operation',
                fixed: 'right',
                render: (text, record) =>
                    this.state.dataSource.length >= 1 ? (
                        <span>
                            <span onClick={() =>{this.props.history.push({ pathname:'/provider-booking-detail' ,state:{_id:record._id}})}}><Icon type="eye" theme="twoTone" twoToneColor="#52c41a" className='f_25' /></span>
                            {/* <span href="#" onClick={() => this.find_booking(record._id)}><Icon type="edit" theme="twoTone" twoToneColor="#52c41a" className='mx-3 f_25' /></span> */}
                            {/* <Popconfirm title="Sure to delete because may be under some more sub_category ?" onConfirm={() => this.delete_booking(record.key)}>
                                <Icon type="delete" theme="twoTone" twoToneColor="#52c41a" className='f_25' />
                            </Popconfirm> */}
                            
                        </span>

                    ) : null,
            },
        ];
        const { dataSource } = this.state;
        return (
            <React.Fragment>
                <Table
                    title={() => <div className="d-flex justify-content-center bold primary_color">My Booking</div>}
                    rowClassName={() => 'editable-row'}
                    className='table_shadow'
                    dataSource={dataSource}
                    columns={columns}
                    scroll={{ x: 'calc(700px + 50%)', y: 240 }}
                    size="middle"
                    style={{borderRadius:"1em"}}
                    pagination={this.state.pagination}
                    onChange={this.handleTableChange}
                    loading={this.state.loading}
                />
            </React.Fragment>
        );
    }
}
export default Form.create()(withRouter(Booking_Table))