import React from 'react'
import { Layout, Form, Input, Button, message, Typography, Row, Col } from 'antd';
import { ADD_STATIC, FIND_STATIC, UPDATE_STATIC } from '../../../graphql/Admin/static';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AdminSider from '../Layout/AdminSider';
import AdminHeader from '../Layout/AdminHeader';
import { client } from "../../../apollo";
import '../../../scss/template.scss';
import '../../../scss/Category.scss';
import { Alert_msg } from '../../Comman/alert_msg';
const { Content } = Layout;
const { Title } = Typography;

class Add_Static extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            dataSource: [],
            loading: false,
            imageUrl: '',
            update: 0,
            update_data: {},
            file: {},
            previewVisible: false,
            previewImage: '',
            pagination: {
                pageSize: 5,
                current: 1,
                total: 0,
                simple: true,
            },
            OPTIONS: ['Apples', 'Nails', 'Bananas', 'Helicopters'],
            selectedItems: [],
            category: [],
            address: '',
            text: ''

        };

    }
    componentDidMount() {
        const { form } = this.props;
        form.resetFields();
        console.log(this.props.match.params.id);
        if (this.props.match.params.id !== undefined) {
            this.fetch_find_static();
        }
    }

    fetch_find_static = async () => {
        await client.query({
            query: FIND_STATIC,
            variables: { _id: this.props.match.params.id },
            fetchPolicy: 'no-cache',
        }).then(result => {
            console.log(result);
            this.setState({ update: 1, update_data: result.data.static[0], text: result.data.static[0].description });
        });
    }
    normFile = e => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    }

    handleChange = info => {
        if (info.file.status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (info.file.status) {
            console.log(info.file.originFileObj);
            this.setState({ file: info.file.originFileObj });
            this.getBase64(info.file.originFileObj, imageUrl =>
                this.setState({
                    imageUrl,
                    loading: false,
                }),
            );
        }
    };

    add_static = () => {
        const { form, history } = this.props;
        form.validateFields(async (err, values) => {
            if (!err) {
                console.log(values);
                await client.mutate({
                    mutation: ADD_STATIC,
                    variables: { page_code: values.page_code, title: values.title, page_name: values.page_name, description: this.state.text },
                }).then((result, loading, error) => {
                    Alert_msg(result.data.add_static.info);
                    if (result.data.add_static.info.status === "success") {
                        history.push('/admin-static');
                    }
                });
            }
        });
    };

    update_static = () => {
        const { form, history } = this.props;
        console.log(this.props);
        form.validateFields(async (err, values) => {
            if (!err) {
                console.log(values);
                await client.mutate({
                    mutation: UPDATE_STATIC,
                    variables: { page_code: values.page_code, title: values.title,page_name: values.page_name, description: this.state.text, _id: this.props.match.params.id },
                }).then((result, loading, error) => {
                    Alert_msg(result.data.update_static.info);
                    if (result.data.update_static.info.status === "success") {
                        history.push('/admin-static');
                    }
                });
            }
        });
    };

    change = (value) => {
        this.setState({ text: value })
    }


    render() {
        const { form } = this.props;

        console.log(this.state.update_data.subCategory_name);
        return (
            <Layout style={{ height: '100vh' }}>
                <AdminSider update_collapsed={this.state.collapsed} />
                <Layout>
                    <AdminHeader />
                    <Content className="main_frame">
                        <Row gutter={[24, 24]}>
                            <Col span={24}>
                                <Title level={3}>Add Static Page</Title>
                            </Col>
                        </Row>
                        <Row>
                            <Form>
                                <Col span={24}>
                                    <Row gutter={12}>
                                        <Col span={12}>
                                            <Form.Item label="Page Name">
                                                {form.getFieldDecorator("page_name", {
                                                    initialValue: this.state.update_data.page_name,
                                                    rules: [{ required: true }]
                                                })(<Input placeholder="Name" />)}
                                            </Form.Item>
                                        </Col>
                                        <Col className="" lg={12}>
                                            <Form.Item label="Page Code">
                                                {form.getFieldDecorator("page_code", {
                                                    initialValue: this.state.update_data.page_code,
                                                    rules: [{ required: true }]
                                                })(<Input placeholder="Code"  disabled={this.state.update}/>)}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            <Form.Item label="Title">
                                                {form.getFieldDecorator("title", {
                                                    initialValue: this.state.update_data.title,
                                                    rules: [{ required: true }]
                                                })(<Input placeholder="Title" />)}
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <Row className="py-3" gutter={12}>
                                        <Col className="" lg={24}>
                                            <ReactQuill value={this.state.text} placeholder="Description" onChange={this.change} />
                                        </Col>

                                        <Col span={24}>
                                            <Form.Item className="float-right">
                                                <Button type="primary" htmlType="submit" className="mx-3" onClick={() => { this.props.history.push('/admin-static') }}>
                                                    Cancel
                                                </Button>
                                                <Button type="primary" className={this.state.update ? 'd-none' : ''} htmlType="submit" onClick={this.add_static}>
                                                    Submit
                                                </Button>
                                                <Button type="primary" className={this.state.update ? '' : 'd-none'} htmlType="submit" onClick={this.update_static}>
                                                    Update
                                                </Button>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                </Col>
                            </Form>
                        </Row>
                    </Content>
                </Layout>
            </Layout >
        );
    }
}

export default Form.create()(Add_Static);
