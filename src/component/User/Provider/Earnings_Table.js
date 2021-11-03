import React from "react";
import { withRouter } from "react-router-dom";
import { Table, Form, Icon,Select } from 'antd';
import { GET_EARNINGS } from '../../../graphql/User/provider';

import { client } from "../../../apollo";
const { Option } = Select;


class EarningsTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            options:'1' ,
            modalVisible: false,
            total_amount: '',
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
        this.setState({ id: JSON.parse(localStorage.getItem('provider'))._id });
        this.fetch_booking(this.state.options);
    }

    handleTableChange =async pagination => {
        const pager = { ...pagination };
        pager.current = pagination.current;
        this.setState({loading:true});
        await client.query({
            query: GET_EARNINGS,
            variables: { limit: pager.pageSize, page: pager.current, provider_id: JSON.parse(localStorage.getItem('provider'))._id , booking_status: 14, option: Number(this.state.options) },
            fetchPolicy: 'no-cache',
        }).then(result => {
            console.log(result.data);
            const pagination = { ...this.state.pagination };
            pagination.total = result.data.get_payout.pageInfo.totalDocs;
            pagination.current = result.data.get_payout.pageInfo.page;
            console.log(pagination);
            this.setState({ pagination, loading: false, dataSource: result.data.get_payout.data, total_amount: result.data.get_payout.pageInfo.total_amount });
        });
    };


    fetch_booking = async (data) => {
        this.setState({ loading: true });
        await client.query({
            query: GET_EARNINGS,
            variables: { provider_id: JSON.parse(localStorage.getItem('provider'))._id , option: Number(data), limit: this.state.pagination.pageSize, page: this.state.pagination.current, booking_status: 14 },
            fetchPolicy: 'no-cache',
        }).then(result => {
            const pagination = { ...this.state.pagination };
            pagination.total = result.data.get_payout.pageInfo.totalDocs;
            this.setState({loading:false, pagination, dataSource: result.data.get_payout.data, total_amount: result.data.get_payout.pageInfo.total_amount });
        });
    }

    earnings_option = value => {
        console.log(value);
        this.setState({ options: value });
        this.fetch_booking(value);
    };

    render() {
        const columns = [
            {
                title: 'Booking Ref',
                width: '25%',
                editable: true,
                render: (text, record) => {
                    console.log(record);
                    return <span title="booking name">{record.booking_ref}</span>;
                },
            },
          
            {
                title: 'Category',
                width: '25%',
                editable: true,
                render: (text, record) => {
                    if (record.category_type === "2") {
                        console.log("dosd");
                        return <span title="booking name">{record.booking_category[0] ? record.booking_category[0].subCategory_name : ""}</span>
                    } else {
                        return <span title="booking name">{record.booking_category[0] ? record.booking_category[0].category_name : ""}</span>
                    }
                },
            },
            {
                title: 'Provider Fee',
                width: '25%',
                editable: true,
                render: (text, record) => {
                    console.log(record);
                    return <span title="booking name">{record.provider_fee}</span>;
                },
            },
            {
                title: 'Action',
                dataIndex: 'operation',
                render: (text, record) =>
                    this.state.dataSource.length >= 1 ? (
                        <span>
                            <span onClick={() => { this.props.history.push({ pathname: '/provider-booking-detail', state: { _id: record._id } }) }}><Icon type="eye" theme="twoTone" twoToneColor="#52c41a" className='f_25' /></span>
                            {/* <span href="#" onClick={() => this.find_booking(record._id)}><Icon type="edit" theme="twoTone" twoToneColor="#52c41a" className='mx-3 f_25' /></span> */}
                            {/* <Popconfirm title="Sure to delete because may be under some more sub_category ?" onConfirm={() => this.delete_booking(record.key)}>
                                <Icon type="delete" theme="twoTone" twoToneColor="#52c41a" className='f_25' />
                            </Popconfirm> */}

                        </span>

                    ) : null,
            },
        ];
        const { dataSource, total_amount, options } = this.state;
        console.log(total_amount);
        return (
            <React.Fragment>
                <Table
                    title={() => <div className="d-flex justify-content-between bold primary_color">
                        <div>
                            Total Earnings : {total_amount}
                        </div>
                        <div>
                            <Select defaultValue={options} style={{ width: 120 }} onChange={this.earnings_option}>
                                <Option value='1'>Week</Option>
                                <Option value='2'>Month</Option>
                                <Option value='3'>Year</Option>
                            </Select>
                        </div>
                    </div>}
                    rowClassName={() => 'editable-row'}
                    className='table_shadow'
                    dataSource={dataSource}
                    columns={columns}
                    size="middle"
                    style={{ borderRadius: "1em" }}
                    pagination={this.state.pagination}
                    onChange={this.handleTableChange}
                    loading={this.state.loading}
                />
            </React.Fragment>
        );
    }
}
export default Form.create()(withRouter(EarningsTable))