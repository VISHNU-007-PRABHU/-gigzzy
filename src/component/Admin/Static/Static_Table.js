import React from "react";
import { withRouter } from "react-router-dom";
import { GET_STATIC, DELETE_STATIC } from '../../../graphql/Admin/static';
import { client } from "../../../apollo";
import { Table, Button, Icon, Popconfirm } from 'antd';
import { Alert_msg } from '../../Comman/alert_msg';

class StaticTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            loading: false,
            pagination: {
                pageSize: 10,
                current: 1,
                total: 0,
                simple: true,
            }
        };
    }
    componentDidMount() {
        this.fetch_static();
    }
    handleTableChange = async pagination => {
        const pager = { ...pagination };
        pager.current = pagination.current;
        this.setState({ loading: true });
        await client.query({
            query: GET_STATIC,
            variables: { limit: pager.pageSize, page: pager.current },
            fetchPolicy: 'no-cache',
        }).then(result => {
            console.log(result.data);
            const pagination = { ...this.state.pagination };
            pagination.total = result.data.get_static.pageInfo.totalDocs;
            pagination.current = result.data.get_static.pageInfo.page;
            console.log(pagination);
            this.setState({ pagination, loading: false, dataSource: result.data.get_static.data });
        });
    };

    fetch_static = async (visible) => {
        this.setState({ loading: true });
        await client.query({
            query: GET_STATIC,
            variables: { limit: this.state.pagination.pageSize, page: this.state.pagination.current },
            fetchPolicy: 'no-cache',
        }).then(result => {
            const pagination = { ...this.state.pagination };
            pagination.total = result.data.get_static.pageInfo.totalDocs;
            this.setState({ loading: false, pagination, dataSource: result.data.get_static.data });
        });
    }

    handleDelete = async (_id) => {
        console.log(_id);
        await client.mutate({
            mutation: DELETE_STATIC,
            variables: { _id: _id },
        }).then((result, loading, error) => {
            Alert_msg(result.data.deleteStatic);
            if (result.data.deleteStatic.status === 'success') {
                this.fetch_static();
            }
        });
    }


    render() {
        const { dataSource } = this.state;

        const columns = [
            {
                title: 'Page Name',
                width: '30%',
                render: (text, record) => {
                    return <span title="page name">{record.page_name}</span>;
                },
            },
            {
                title: 'Page Code',
                width: '30%',
                render: (text, record) => {
                    return <span title="page code">{record.page_code}</span>;
                },
            },
            {
                title: 'Action',
                dataIndex: 'operation',
                render: (text, record) =>
                    this.state.dataSource.length >= 1 ? (
                        <span title="...." className="d-flex d-sm-inline justify-content-around">
                            <span className="cursor_point" onClick={() => { this.props.history.push(`/admin-static/add/${record._id}`); }}><Icon type="edit" theme="twoTone" twoToneColor="#52c41a" className='mx-3 f_25' /></span>
                            <Popconfirm title="Sure to delete Static data ?" onConfirm={() => this.handleDelete(record._id)}>
                                <Icon type="delete" theme="twoTone" twoToneColor="#52c41a" className='f_25' />
                            </Popconfirm>
                        </span>
                    ) : null,
            },
        ];


        return (
            <div>
                <div className='my-3'>
                    <Button type="primary" onClick={() => { this.props.history.push('/admin-static/add'); }}>
                        Add Static Pages
                    </Button>
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

export default withRouter(StaticTable);