import React, { Suspense } from "react";
import { withRouter } from "react-router-dom";
import { Table, Button, Popconfirm, Form, Icon, Modal, Avatar, Switch } from 'antd';
import { GET_SUBCATEGORY, UPDATE_SUBCATEGORY, DELETE_SUBCATEGORY } from '../../../graphql/Admin/sub_category';
import { client } from "../../../apollo";
import { Alert_msg } from '../../Comman/alert_msg';
import '../../../scss/template.scss';

const SearchCategory = React.lazy(() => import('../User/SearchCategory'));
const SearchSubcategory = React.lazy(() => import('../User/SearchSubcategory'));

class EditableTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            dataSource: [],
            loading: false,
            imageUrl: '',
            file: {},
            input_data: {},
            previewVisible: false,
            previewImage: '',
            view_img: '',
            pagination: {
                pageSize: 10,
                current: 1,
                total: 0,
                simple: true,
            }
        };

    }

    componentDidMount() {
        this.fetch_subCategory();
    }
    fetch_subCategory = async (datas) => {
        this.setState({ loading: true });
        let input = {};
        input = { limit: this.state.pagination.pageSize, page: this.state.pagination.current, data: datas }
        await client.query({
            query: GET_SUBCATEGORY,
            variables: input,
            fetchPolicy: 'no-cache',
        }).then(result => {
            const pagination = { ...this.state.pagination };
            pagination.total = result.data.get_subcategory.pageInfo.totalDocs;
            this.setState({ loading: false, pagination, dataSource: result.data.get_subcategory.data });
        });
    }
    handleTableChange = async pagination => {
        const pager = { ...pagination };

        pager.current = pagination.current;
        console.log(pager.current);
        this.setState({ loading: true });
        var input = { data: this.state.input_data, limit: pager.pageSize, page: pager.current }
        await client.query({
            query: GET_SUBCATEGORY,
            variables: input,
            fetchPolicy: 'no-cache',
        }).then(result => {
            const pagination = { ...this.state.pagination };
            pagination.total = result.data.get_subcategory.pageInfo.totalDocs;
            pagination.current = result.data.get_subcategory.pageInfo.page;
            this.setState({ pagination, loading: false, dataSource: result.data.get_subcategory.data });
        });
    };

    change_future = async (data) => {
        await client.mutate({
            mutation: UPDATE_SUBCATEGORY,
            variables: data,
            refetchQueries: [{ query:GET_SUBCATEGORY}],
            awaitRefetchQueries: true,
        }).then((result, loading, error) => {
            Alert_msg(result.data.updatesubCategory.info);
            this.fetch_subCategory();
        });
    }

    handleDelete = async (_id) => {
        console.log(_id);
        await client.mutate({
            mutation: DELETE_SUBCATEGORY,
            variables: { _id: _id },
        }).then((result, loading, error) => {
            Alert_msg(result.data.deletesubCategory);
            if (result.data.deletesubCategory.status === 'success') {
                this.fetch_subCategory();
            }
        });
    }

    onFilter = async (data) => {
        console.log(Object.keys(data)[0]);
        if (data[Object.keys(data)[0]] == '') {
            delete this.state.input_data[Object.keys(data)[0]];
            var data_pass = this.state.input_data;
            this.setState({ input_data: data_pass })
            this.fetch_subCategory(data_pass);
        } else {
            this.setState({ input_data: { ...this.state.input_data, ...data } });
            var input_data = { ...this.state.input_data, ...data };
            this.fetch_subCategory(input_data);
        }
    }

    render() {
        const columns = [
            {
                title: () => {
                    return <div>
                        <div className="d-block">
                            <>
                                <Suspense fallback={<div>.......</div>}>
                                    <SearchCategory value='category_name' placeholder='Enter Category' passedFunction={this.onFilter} />
                                </Suspense>
                            </>
                        </div>
                    </div>
                },
                width: '20%',
                render: (text, record) => {
                    return <span title="Category Name">{record.category[0] ? record.category[0].category_name : ''}</span>;
                }
            },
            {
                title: () => {
                    return <div>
                        <div className="d-block">
                            <>
                                <Suspense fallback={<div>.......</div>}>
                                    <SearchSubcategory value='subCategory_name' id='_id' placeholder='Enter Sub Category' passedFunction={this.onFilter} />
                                </Suspense>
                            </>
                        </div>
                    </div>
                },
                dataIndex: 'category_name',
                render: (text, record) => {
                    return <span title="Sub Category Name">{record.subCategory_name}</span>;
                }
            },
            {
                title: 'Limit(Per Job)',
                dataIndex: '',
                width: '5%',
                render: (text, record) => {
                    return <span title="Hour Limit">{record.hour_limit}</span>;
                }
            },
            {
                title: 'Basic Price',
                width: '10%',
                render: (text, record) => {
                    return <span title="Basic Price'">{record.base_price}</span>;
                }
            },
            {
                title: 'Price(Per Day Price)',
                dataIndex: '',
                width: '10%',
                render: (text, record) => {
                    return <span title="Hours Price">{record?.day_price}</span>;
                }
            },
            {
                title: 'Service Fee',
                width: '10%',
                render: (text, record) => {
                    return <span title="Service Fee" className="d-flex align-items-center">{record.service_fee}<Icon className="px-2" type="percentage" /></span>;
                }
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
                title: <span>Featured</span>,
                width: '5',
                render: (text, record) => {
                    return <span title="Future">{
                        <Switch
                            checkedChildren="Show"
                            unCheckedChildren="Hide"
                            checked={record.is_future}
                            onChange={(checked) => { this.change_future({ is_future: checked, _id: record._id }) }} />}</span>;
                },
            },
            {
                title: 'Image',
                width: '5%',
                render: (text, record) => {
                    console.log(record.img_url);
                    const { previewVisible } = this.state;
                    return (
                        <span title="Image" className="clearfix">
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
                width: '7%',
                dataIndex: 'operation',
                render: (text, record) =>
                    this.state.dataSource.length >= 1 ? (
                        <span title="...." className="d-flex d-sm-inline justify-content-around">
                            <span className="cursor-point" onClick={() => { this.props.history.push(`/admin-add-subcategory/${record._id}`); }}><Icon type="edit" theme="twoTone" twoToneColor="#52c41a" className='mx-3 f_25' /></span>
                            <Popconfirm title="Sure to delete because may be under some more bookings ?" onConfirm={() => this.handleDelete(record._id)}>
                                <Icon type="delete" theme="twoTone" twoToneColor="#52c41a" className='f_25' />
                            </Popconfirm>
                        </span>
                    ) : null,
            },
        ];
        const { dataSource } = this.state;

        return (
            <div>
                <div className='my-3'>
                    <Button type="primary" onClick={() => { this.props.history.push('/admin-add-subcategory'); }}>
                        Add Sub Category
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

export default Form.create()(withRouter(EditableTable));
