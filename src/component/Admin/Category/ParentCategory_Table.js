import * as React from "react";
import { withRouter } from "react-router-dom";
import { Table, Button, Modal, Form, Avatar, Popconfirm, Tag, Icon,Switch } from "antd";
import { GET_CATEGORY, UPDATE_CATEGORY,CHNAGE_PARENT_BLOCK, DELETE_CATEGORY } from '../../../graphql/Admin/category';
import { client } from "../../../apollo";
import '../../../scss/template.scss';
import { Alert_msg } from '../../Comman/alert_msg';
import Search from "antd/lib/input/Search";

class ParentCategory_Table extends React.Component {
    state = {
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
        view_img: '',
        pagination: {
            pageSize: 10,
            total: 0,
            current: 1,
            simple: true,
        }
    }
    componentDidMount() {
        this.fetch_category({ is_parent: true });
    }
    handleTableChange = async pagination => {
        const pager = { ...pagination };
        pager.current = pagination.current;
        this.setState({ loading: true });
        await client.query({
            query: GET_CATEGORY,
            variables: { limit: pager.pageSize, page: pager.current, data: { is_parent: true } },
            fetchPolicy: 'no-cache',
        }).then(result => {
            const pagination = { ...this.state.pagination };
            pagination.total = result.data.get_category.pageInfo.totalDocs;
            pagination.current = result.data.get_category.pageInfo.page;
            console.log(pagination);
            this.setState({ pagination, loading: false, dataSource: result.data.get_category.data });
        });
    };

    showModal = () => {
        this.setState({ modalVisible: true });
    };

    closeModal = () => {
        this.setState({ modalVisible: false, update_data: {}, imageUrl: '' });
    };

    fetch_category = async (datas) => {
        this.setState({ loading: true });
        await client.query({
            query: GET_CATEGORY,
            variables: { data: datas },
            fetchPolicy: 'no-cache',
        }).then(result => {
            const pagination = { ...this.state.pagination };
            pagination.total = result.data.get_category.pageInfo.totalDocs;
            this.setState({ loading: false, pagination, dataSource: result.data.get_category.data });
        });
    }

    change_future = async (data) => {
        await client.mutate({
            mutation: CHNAGE_PARENT_BLOCK,
            variables: data,
        }).then((result, loading, error) => {
            Alert_msg(result.data.change_parent_bolck.info);
            this.fetch_category({ is_parent: true });
        });
    }


    handleDelete = async (_id) => {
        console.log(_id);
        await client.mutate({
            mutation: DELETE_CATEGORY,
            variables: { _id: _id },
        }).then((result, loading, error) => {
            Alert_msg(result.data.deleteCategory);
            if (result.data.deleteCategory.status === 'success') {
                this.fetch_category({ is_parent: true });
            }
        });
    }

    onFilter_Ref = async (data) => {
        if (data.target.value) {
            var datas = { is_parent: true,'category_name': { $regex: '.*' + data.target.value + '.*',$options: 'i' } }
            this.fetch_category(datas);
        } else {
            this.fetch_category({ is_parent: true });
        }
    }

    render() {
        const columns = [
            {
                title: <span>Category Name</span>,
                dataIndex: 'category_name',
                width: '15%',
                render: (text, record) => {
                    return <span title="Category Name">{record.category_name}</span>;
                }
            },
            {
                title: <span>Description</span>,
                dataIndex: 'description',
                render: (text, record) => {
                    return <span title="Description" style={{ wordBreak: "break-all" }}>{record.description}</span>;
                },
            },
            {
                title: <span>Block</span>,
                width: '10%',
                render: (text, record) => {
                    return <span title="Block">
                        {<Switch
                            checkedChildren="Show"
                            unCheckedChildren="Hide"
                            checked={record.is_block}
                            onChange={(checked) => { this.change_future({ is_block: checked, _id: record._id }) }} />}
                    </span>;
                },
            },
            {
                title: <span>Type</span>,
                dataIndex: 'is_parent',
                render: (text, record) => {
                    return <span title="Type">{record.is_parent ? <Tag color="green">Parent</Tag> : <Tag color="geekblue">Category</Tag>}</span>;
                },
            },

            {
                title: <span>Marker</span>,
                render: (text, record) => {
                    console.log(record.img_url);
                    const { previewVisible } = this.state;
                    return (
                        <span title="Marker" className="clearfix">
                            <Avatar
                                src={record.img_url}
                                className="img_zoom"
                                onClick={() => { this.setState({ previewVisible: true, view_img: record.img_url }) }}
                            />
                            <Modal visible={previewVisible} footer={null} onCancel={() => { this.setState({ previewVisible: false }) }}>
                                <img alt="example" style={{ width: '100%' }} src={this.state.view_img} />
                            </Modal>
                        </span>
                    );
                }
            },
            {
                title: 'Action',
                width: '10%',
                dataIndex: 'operation',
                render: (text, record) =>
                    this.state.dataSource.length >= 1 ? (
                        <span title="...." className="d-flex d-sm-inline justify-content-around">
                            <span className="cursor_point" onClick={() => { this.props.history.push(`/admin-category/add/${record._id}`); }}><Icon type="edit" theme="twoTone" twoToneColor="#52c41a" className='mx-3 f_25' /></span>
                            <Popconfirm title="Sure to delete because may be under some more sub_category ?" onConfirm={() => this.handleDelete(record._id)}>
                                <Icon type="delete" theme="twoTone" twoToneColor="#52c41a" className='f_25' />
                            </Popconfirm>
                        </span>

                    ) : null,
            },
        ];

        return (
            <React.Fragment>

                <div className='mb-3'>
                    <Search className='' size="large" placeholder="Search Category" onKeyUp={(event) => { this.onFilter_Ref(event) }} loading={false} />

                </div>
                <div id="no-more-tables">
                    <Table
                        className='table_shadow'
                        pagination={this.state.pagination}
                        rowKey={record => record.id}
                        loading={this.state.loading}
                        dataSource={this.state.dataSource}
                        columns={columns}
                        onChange={this.handleTableChange}
                    />
                </div>
            </React.Fragment>
        );
    }
}

export default Form.create()(withRouter(ParentCategory_Table));