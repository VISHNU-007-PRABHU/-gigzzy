import React,{Suspense} from "react";
import { withRouter } from "react-router";
import { Table, Icon, Tag } from 'antd';
import { GET_BOOKING } from '../../../graphql/Admin/booking';
import { client } from "../../../apollo";
import Search from "antd/lib/input/Search";

const EmailSearch = React.lazy(() => import('../User/EmailSearch'));
const DateSearch = React.lazy(() => import('../User/DateSearch'));
const SearchCategory = React.lazy(() => import('../User/SearchCategory'));
const SearchSubcategory = React.lazy(() => import('../User/SearchSubcategory'));

class CompletedTable extends React.Component {
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
            input_data: {},
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
        this.fetch_booking({limit: this.state.pagination.pageSize, page: this.state.pagination.current, booking_status: [14]});
    }
    handleTableChange = pagination => {
        const pager = { ...pagination };
        pager.current = pagination.current;
        this.setState({ loading: true });
        var input = { ...this.state.input_data, limit: pager.pageSize, page: pager.current, booking_status: [14]}
        client.query({
            query: GET_BOOKING,
            variables: input,
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


    fetch_booking = async (data) => {
        this.setState({ loading: true });
        await client.query({
            query: GET_BOOKING,
            variables: data,
            fetchPolicy: 'no-cache',
        }).then(result => {
            const pagination = { ...this.state.pagination };
            pagination.total = result.data.get_booking.pageInfo.totalDocs;
            this.setState({ pagination, dataSource: result.data.get_booking.data, loading: false });
        });
    }

    onFilter = async (data) => {
        console.log(Object.keys(data)[0]);
        if (data[Object.keys(data)[0]] == '') {
            delete this.state.input_data[Object.keys(data)[0]];
            var data_pass = this.state.input_data;
            this.setState({ input_data: data_pass})
            this.fetch_booking({...data_pass,limit: 10, page: 1,booking_status: [14] });
        } else {
            this.setState({ input_data: { ...this.state.input_data, ...data } });
            var input_data = { ...this.state.input_data, ...data };
            this.fetch_booking({...input_data,limit: 10, page: 1,booking_status: [14]});
        }
    }

    onFilter_Ref = async (data) => {
        if (data.target.value) {
            this.fetch_booking({ booking_ref: { $regex: '.*' + data.target.value + '.*', $options: 'i' }, limit: 10, page: 1 });
        } else {
            this.fetch_booking({ limit: 10, page: 1,booking_status: [14]});
        }
    }

    render() {
        const columns = [
            {
                title: () => {
                    return <div>
                        Booking Ref
                    </div>
                },
                width: '8%',
                editable: true,
                render: (text, record) => {
                    return <span title="User">{record?.booking_ref}</span>;
                },
            },
            {
                title: () => {
                    return <div>
                        <div className="d-block">
                            <>
                                <Suspense fallback={<div>.......</div>}>
                                    <EmailSearch role={1} value='name' placeholder='Enter User' passedFunction={this.onFilter} />
                                </Suspense>
                            </>
                        </div>
                    </div>
                },
                width: '15%',
                editable: true,
                render: (text, record) => {
                    return <span title="User">{record.booking_user[0] ? record.booking_user[0].name : ''}</span>;
                },
            },
            {
                title: () => {
                    return <div>
                        <div className="d-block">
                            <>
                                <Suspense fallback={<div>.......</div>}>
                                    <EmailSearch role={2} value='name' placeholder='Enter Provider' passedFunction={this.onFilter} />
                                </Suspense>
                            </>
                        </div>
                    </div>
                },
                width: '15%',
                editable: true,
                render: (text, record) => {
                    return <span title="Provider">{record.booking_provider[0] ? record.booking_provider[0].name : 'Not Assign'}</span>;
                },
            },
            {
                title: () => {
                    return <div>
                        <div className="d-block">
                            <>
                                <Suspense fallback={<div>.......</div>}>
                                    <SearchSubcategory value='subCategory_name' id="category_id" placeholder='Enter Sub Category' passedFunction={this.onFilter} />
                                </Suspense>
                            </>
                        </div>
                    </div>
                },
                width: '15%',
                editable: true,
                render: (text, record) => {
                    return <span title="Sub Category">{
                        record.booking_category[0] ? record.booking_category[0].subCategory_name ? record.booking_category[0].subCategory_name : 'Main Category' : 'Main Category'
                    }</span>;

                },
            },
            {
                title: () => {
                    return <div>
                        Category
                        {/* <div className="d-block">
                            <>
                                <Suspense fallback={<div>.......</div>}>
                                    <SearchCategory  value='category_name' placeholder='Enter Category' passedFunction={this.onFilter}/>
                                </Suspense>
                            </>
                        </div> */}
                    </div>
                },
                width: '15%',
                editable: true,
                render: (text, record) => {
                    if (record.category_type === "2") {
                        return <>
                            <span title="Category">{record.booking_category[0] ?
                                record.booking_category[0].booking_parent_category[0] ?
                                    record.booking_category[0].booking_parent_category[0].category_name : "" : ""}</span>
                        </>
                    } else {
                        return <span title="Category">{record.booking_category[0] ? record.booking_category[0].category_name : ""}</span>
                    }
                },
            },
            {
                title: () => {
                    return <div>
                        <div className="d-block">
                            <>
                                <Suspense fallback={<div>.......</div>}>
                                    <DateSearch role='1' value='boo' placeholder='Enter Booking Date' passedFunction={this.onFilter} />
                                </Suspense>
                            </>
                        </div>
                    </div>
                },
                width: '15%',
                editable: true,
                render: (text, record) => {
                    return <span title="Booked" style={{ wordBreak: "keep-all" }}>{record.booking_date}</span>;
                },
            },
            {
                title: 'Status',
                width: '15%',
                editable: true,
                render: (text, record) => {
                    // booking==12,provider_cancel==8,provider_accept==9,user_accept==10,user_cancel==11,end==13,complete=14, 
                    if (record.booking_status === 14) {
                        return <span title="Status"> <Tag color="cyan">Completed</Tag> </span>;
                    }else if (record.booking_status === 13) {
                        return <span title="Status"> <Tag color="cyan">End</Tag> </span>;
                    } else if (record.booking_status === 10) {
                        return <span title="Status"> <Tag color="cyan">User Accept</Tag> </span>;
                    }else if (record.booking_status === 8) {
                        return <span title="Status"> <Tag color="cyan">Provider Cancel</Tag> </span>;
                    } else if (record.booking_status === 11) {
                        return <span title="Status"> <Tag color="cyan">User Cancel</Tag> </span>;
                    }
                },
            },
            {
                title: 'Action',
                dataIndex: 'operation',
                render: (text, record) =>
                    this.state.dataSource.length >= 1 ? (
                        <span title="...." className="d-flex d-sm-inline justify-content-around">
                            <span className='cursor_point' onClick={() => { this.props.history.push({ pathname: '/admin-booking-detail', state: { _id: record._id } }) }}><Icon type="eye" theme="twoTone" twoToneColor="#52c41a" className='f_25' /></span>
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
                <Search prefix={'#'} className='mb-3' size="large" placeholder="Search Booking Ref" onKeyUp={(event) => { this.onFilter_Ref(event) }} loading={false} />

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

export default withRouter(CompletedTable);