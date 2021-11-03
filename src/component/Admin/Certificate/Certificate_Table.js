import React from "react";
import { Table, Modal, Form, Input, Button,Icon,Popconfirm } from 'antd';
import { GET_CERTIFICATE, ADD_CERTIFICATE,FIND_CERTIFICATE,UPDATE_CERTIFICATE, DELETE_CERTIFICATE } from '../../../graphql/Admin/certificate';
import {  client } from "../../../apollo";
import { Alert_msg } from '../../Comman/alert_msg';

class CertificateTable extends React.Component {
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
        this.fetch_certificate();
    }
    handleTableChange =async pagination => {
        const pager = { ...pagination };
        pager.current = pagination.current;
        this.setState({ loading: true });
        await client.query({
            query: GET_CERTIFICATE,
            variables: { limit: pager.pageSize, page: pager.current },
            fetchPolicy: 'no-cache',
        }).then(result => {
            console.log(result.data);
            const pagination = { ...this.state.pagination };
            pagination.total = result.data.get_certificate.pageInfo.totalDocs;
            pagination.current = result.data.get_certificate.pageInfo.page;
            console.log(pagination);
            this.setState({ pagination, loading: false, dataSource: result.data.get_certificate.data });
        });
    };


    fetch_certificate = (visible) => {
        this.setState({ loading: true });
        client.query({
            query: GET_CERTIFICATE,
            variables: { limit: this.state.pagination.pageSize, page: this.state.pagination.current },
            fetchPolicy: 'no-cache',
        }).then(result => {
            const pagination = { ...this.state.pagination };
            pagination.total = result.data.get_certificate.pageInfo.totalDocs;
            this.setState({ loading:false,pagination, dataSource: result.data.get_certificate.data });
        });
    }

    find_certificate = async (_id) => {
        console.log(_id);
        await client.query({
            query: FIND_CERTIFICATE,
            variables: {_id:_id},
            fetchPolicy: 'no-cache',
        }).then(result => {
            console.log(result);
            this.setState({modalVisible:1,update:1,update_data: result.data.certificate[0]});
        });
    }

    add_certificate = () => {
        const { form } = this.props;
        form.validateFields(async (err, values) => {
            if (!err) {
                console.log(values);
                await client.mutate({
                    mutation: ADD_CERTIFICATE,
                    variables: { certificate_name: values.certificate_name },
                }).then((result, loading, error) => {
                    Alert_msg(result.data.add_certificate.info);
                    if(result.data.add_certificate.info.status==='success'){
                        this.setState({modalVisible:0});
                        form.resetFields();
                        this.fetch_certificate();
                    }
                });
            }
        });
    };

    handleDelete = async (_id) => {
        console.log(_id);
        await client.mutate({
            mutation: DELETE_CERTIFICATE,
            variables: { _id: _id },
        }).then((result, loading, error) => {
            Alert_msg(result.data.deleteCertificate);
            if (result.data.deleteCertificate.status === 'success') {
                this.fetch_certificate();
            }
        });
    }

    update_certificate= (_id) => {
        const { form } = this.props;
        form.validateFields(async (err, values) => {
            if (!err) {
                console.log(values);
                await client.mutate({
                    mutation: UPDATE_CERTIFICATE,
                    variables: {certificate_name: values.certificate_name, _id:_id},
                }).then((result, loading, error) => {
                    console.log(result);
                    Alert_msg(result.data.update_certificate.info);
                   if(result.data.update_certificate.info.status === "success"){
                    form.resetFields();
                     this.setState({ modalVisible: false,update_data:{}});
                   }
                   this.fetch_certificate();
                });
            }
        });
    };
    render() {
        const columns = [
            {
                title: 'Certificates Name',
                width: '50%',
                editable: true,
                render: (text, record) => {
                    return <span title="Certificate name">{record.certificate_name}</span>;
                },
            },
            {
                title: 'Action',
                dataIndex: 'operation',
                render: (text, record) =>
                    this.state.dataSource.length >= 1 ? (
                        <span title="...." className="d-flex d-sm-inline justify-content-around">
                        <span className="cursor_point" onClick={() => this.find_certificate(record._id)}><Icon type="edit"  theme="twoTone" twoToneColor="#52c41a" className='mx-3 f_25' /></span>
                        <Popconfirm title="Sure to delete this certificate ?" onConfirm={() => this.handleDelete(record._id)}>
                            <Icon type="delete"  theme="twoTone" twoToneColor="#52c41a" className='f_25' />
                        </Popconfirm>
                    </span>

                    ) : null,
            },
        ];
        const { dataSource } = this.state;
        const { form } = this.props;
        return (
            <React.Fragment>
                <Modal
                    onOk={e => { this.state.update ? this.update_certificate(this.state.update_data._id) : this.add_certificate() }}
                    onCancel={() => { this.setState({ modalVisible: 0}) }}
                    title="Add Certificate"
                    // confirmLoading={loading}
                    visible={this.state.modalVisible}
                >
                    <Form>
                        <Form.Item label="Certificate Name">
                            {form.getFieldDecorator("certificate_name", {
                                initialValue: this.state.update_data.certificate_name,
                                rules: [{ required: true }]
                            })(<Input placeholder="Certificate Name"/>)}
                        </Form.Item>
                    </Form>
                </Modal>
                <div style={{ marginBottom: "12px" }}>
                    <Button onClick={() => { this.setState({ modalVisible: 1,update_data:{} }); form.resetFields(); }} type="primary"> Add Certificate </Button>
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
            </React.Fragment>
        );
    }
}

export default Form.create()(CertificateTable);