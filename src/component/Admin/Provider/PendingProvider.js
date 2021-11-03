import React from "react";
import { withRouter } from "react-router-dom";
import { GET_USER, DELETE_USER,USER_EMAIL_QUERY } from '../../../graphql/Admin/user';
import { client } from "../../../apollo";
import { Table, Button, Icon, Popconfirm,Tag } from 'antd';
import { Alert_msg } from '../../Comman/alert_msg';
import Search from "antd/lib/input/Search";

class PendingPovider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            loading:false,
            pagination: {
                pageSize: 10,
                current: 1,
                total: 0,
                simple: true,
            }
        };
    }
    componentDidMount() {
        this.fetch_user();
    }
    handleTableChange =async pagination => {
        const pager = { ...pagination };
        pager.current = pagination.current;
        this.setState({ loading: true });

        await client.query({
            query: GET_USER,
            variables: { limit: pager.pageSize, page: pager.current, role: "2",proof_status:0 },
            fetchPolicy: 'no-cache',
        }).then(result => {
            console.log(result.data);
            const pagination = { ...this.state.pagination };
            pagination.total = result.data.get_user.pageInfo.totalDocs;
            pagination.current = result.data.get_user.pageInfo.page;
            console.log(pagination);
            this.setState({ pagination, loading: false, dataSource: result.data.get_user.data });
        });
    };

    fetch_user =async (visible) => {
        this.setState({ loading: true });

        await client.query({
            query: GET_USER,
            variables: { limit: this.state.pagination.pageSize, page: this.state.pagination.current, role: "2",proof_status:0 },
            fetchPolicy: 'no-cache',
        }).then(result => {
            const pagination = { ...this.state.pagination };
            pagination.total = result.data.get_user.pageInfo.totalDocs;
            this.setState({loading:false, pagination, dataSource: result.data.get_user.data });
        });
    }


    handleDelete = async (_id) => {
        console.log(_id);
        await client.mutate({
            mutation: DELETE_USER,
            variables: { _id: _id },
        }).then((result, loading, error) => {
            Alert_msg(result.data.deleteDetails);
            if (result.data.deleteDetails.status === 'success') {
                this.fetch_user();
            }
        });
    }

    onFilter = async (value) => {
        console.log(value.target.value);
        var datas={delete:0,role:2,proof_status:0, $or:[{ 'name': { $regex: '.*' +value.target.value + '.*',$options:'i' } },{ 'email': { $regex: '.*' +value.target.value + '.*',$options:'i' } }, { 'phone_no': { $regex: '.*' + value.target.value + '.*',$options:'i' } }]}
        await client.query({
            query: USER_EMAIL_QUERY,
            variables: { data: datas },
            fetchPolicy: 'no-cache',
        }).then(result => {
            this.setState({dataSource:result?.data?.user_search});
        });
    }
    render() {
        const { dataSource } = this.state;

        const columns = [
            {
                title: 'Name',
                width: '20%',
                render: (text, record) => {
                    return <span title="Name">{record.name}</span>;
                }
            },
            {
                title: 'Email',
                width: '20%',
                render: (text, record) => {
                    return <span title="Email" style={{ wordBreak: "keep-all"}}>{record.email}</span>;
                }
            },
            {
                title: 'Phone Number',
                width: '20%',
                render: (text, record) => {
                    return <span title="Phone Number">{record.phone_no}</span>;
                }
            },
            {
                title: 'Proof Status',
                width: '20%',
                render: (text, record) => {
                    return <span title="Proof Status">{record.proof_status === 0 ? <Tag color="volcano">pending</Tag> : <Tag color="green">verified</Tag> }</span>;
                }
            },
            {
                title: 'Action',
                dataIndex: 'operation',
                render: (text, record) =>
                    this.state.dataSource.length >= 1 ? (
                        <span title="...." className="d-flex d-sm-inline justify-content-around">
                             <span className="cursor_point" onClick={() => { this.props.history.push(`/admin-provider/view/${record._id}`); }}><Icon type="eye"  theme="twoTone" twoToneColor="#52c41a" className='mr-2 f_25' /></span>
                             <span className="cursor_point" onClick={() => { this.props.history.push(`/admin-provider/add/${record._id}`); }}><Icon type="edit"  theme="twoTone" twoToneColor="#52c41a" className='mx-3 f_25' /></span>
                            <Popconfirm title="Sure to delete this provider ?" onConfirm={() => this.handleDelete(record._id)}>
                                <Icon type="delete"  theme="twoTone" twoToneColor="#52c41a" className='f_25' />
                            </Popconfirm>
                        </span>) : null,
            },
        ];
        return (
            <div>
                <div className='mb-3'>
                    
                    <Search className='mt-3' size="large" placeholder="search"  onKeyUp={(event) => { this.onFilter(event) }} loading={false} />
                </div>
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
            </div>
        );
    }
}

export default withRouter(PendingPovider);